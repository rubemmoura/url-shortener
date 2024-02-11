import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import KnexSingleton from '../database/knexSingleton';
import BlackListRepository from '../repositories/blackListRepository';
import RoleRepository from '../repositories/roleRepository';
import UserRepository from "../repositories/userRepository";

class AuthController {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;
    private blackListRepository: BlackListRepository;

    constructor() {
        this.userRepository = new UserRepository(KnexSingleton);
        this.roleRepository = new RoleRepository(KnexSingleton);
        this.blackListRepository = new BlackListRepository(KnexSingleton);
    }

    public registerUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, password, role } = req.body;
            const [roleDb, existingUser] = await Promise.all([
                this.roleRepository.getRoleByName(role),
                this.userRepository.getUserByEmail(email)
            ]);

            if (!roleDb) {
                return res.status(400).json({ message: 'This role doesn\'t exists' });
            }

            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const newUser = await this.userRepository.createUser({ email, password, role_id: roleDb.id });
            return res.status(201).json(newUser);
        } catch (error) {
            console.error('Error trying to register new user:', error);
            return res.status(500).json({ message: 'Error trying to register new user' });
        }
    }

    public deleteUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email } = req.body;
            const [existingUser] = await Promise.all([
                this.userRepository.getUserByEmail(email)
            ]);

            if (!existingUser) {
                return res.status(404).json({ message: 'User doesn\'t exists' });
            }

            await this.userRepository.deleteUserByEmail(email)
            return res.status(200).json({ message: 'Deleted' });
        } catch (error) {
            console.error('Error trying to delete user:', error);
            return res.status(500).json({ message: 'Error trying to delete user' });
        }
    }

    public loginUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { email, password } = req.body;

            const user = await this.userRepository.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const role = await this.roleRepository.getRoleById(user.role_id);

            // Gera um token JWT
            const token = jwt.sign({ userId: user.id, email: user.email, role: role.name }, 'seu_segredo_secreto_aqui', { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successfully', token });
        } catch (error) {
            console.error('Error trying to login:', error);
            return res.status(500).json({ message: 'Error trying to login' });
        }
    }

    public verifyToken = async (req: Request, res: Response): Promise<Response | undefined> => {
        try {
            const token = req.body.token;

            const blackListItem = await this.blackListRepository.getBlackListItemByToken(token);
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
            console.error('Error trying to verify token:', error);
            return res.status(500).json({ message: 'Error trying to verify token' });
        }
    }

    public logoutUser = async (req: Request, res: Response): Promise<Response> => {
        try {
            const token = req.body.token;
            const blackListItem = await this.blackListRepository.createBlackListItem({ token });

            return res.status(200).json({ message: 'You have successfully logged out', blackListItem });
        } catch (error) {
            console.error('Error trying to logout:', error);
            return res.status(500).json({ message: 'Error trying to logout' });
        }
    }
}

export default AuthController;
