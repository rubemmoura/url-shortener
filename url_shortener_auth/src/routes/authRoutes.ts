import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import KnexSingleton from '../database/knexSingleton';
import UserRepository from "../repositories/userRepository"
import RoleRepository from '../repositories/roleRepository';
import BlackListRepository from '../repositories/blackListRepository';
import { AuthenticationUserValidator } from '../validators/authenticationUserValidator';
import { RegisterUserValidator } from '../validators/registerUserValidator';
import { VerifyTokenValidator } from '../validators/verifyTokenValidator';
import { LogoutValidator } from '../validators/logoutValidator';

const router = express.Router();
const userRepository = new UserRepository(KnexSingleton);
const roleRepository = new RoleRepository(KnexSingleton);
const blackListRepository = new BlackListRepository(KnexSingleton);
const jwtSecret = process.env.JWT_SECRET || '';

router.post('/register', RegisterUserValidator.validate, async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;
        const [roleDb, existingUser] = await Promise.all([
            roleRepository.getRoleByName(role),
            userRepository.getUserByEmail(email)
        ]);

        if (!roleDb) {
            return res.status(400).json({ message: 'This role doesn\'t exists' });
        }

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await userRepository.createUser({ email, password, role_id: roleDb.id });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error trying to register new user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', AuthenticationUserValidator.validate, async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const role = await roleRepository.getRoleById(user.role_id);

        // Gera um token JWT
        const token = jwt.sign({ userId: user.id, email: user.email, role: role.name }, 'seu_segredo_secreto_aqui', { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successfully', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/verify-token', VerifyTokenValidator.validate, async (req: Request, res: Response) => {
    try {
        const token = req.body.token;

        const blackListItem = await blackListRepository.getBlackListItemByToken(token);
        if (blackListItem) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // TODO: Try to use jwtSecret from .env
        // jwt.verify(token, jwtSecret as string, (err: any, decoded: any) => {
        jwt.verify(token, 'seu_segredo_secreto_aqui' as string, (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                return res.status(200).json({ message: 'Valid token', decoded });
            }
        });
    } catch (error) {
        console.error('Error trying verify token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/logout', LogoutValidator.validate, async (req: Request, res: Response) => {
    try {
        const token = req.body.token;
        const blackListItem = await blackListRepository.createBlackListItem({ token });

        return res.status(200).json({ message: 'You have successfully logged out', blackListItem });
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
