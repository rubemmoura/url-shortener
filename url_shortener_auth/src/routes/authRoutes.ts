import express, { Request, Response } from 'express';
import UserRepository from "../repositories/userRepository"
import KnexSingleton from '../database/knexSingleton';

const router = express.Router();
const userRepository = new UserRepository(KnexSingleton);

// Rota para registrar um novo usuário
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        // Verifica se o usuário já existe
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'O usuário já existe' });
        }

        // Cria um novo usuário
        const newUser = await userRepository.createUser({ email, password, role });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para fazer login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Verifica se o usuário existe
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Verifica se a senha está correta
        if (password !== user.password) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        return res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

export default router;
