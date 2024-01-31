import axios, { AxiosError } from 'axios';
import { Role } from '../../interfaces/role';
import UserRepository from '../../repositories/userRepository';
import knexSingleton from './database/knexSingletonTest';

describe('POST /register', () => {
    const userRepository = new UserRepository(knexSingleton);
    beforeAll(async () => {
        await Promise.all([
            userRepository.deleteUserByEmail('test@example.com'),
            userRepository.createUser({ email: 'emailAlreadyExists@example.com', password: 'password', role_id: 1 })
        ]);
    });

    afterAll(async () => {
        await Promise.all([
            userRepository.deleteUserByEmail('test@example.com'),
            userRepository.deleteUserByEmail('emailAlreadyExists@example.com')
        ]);
    });

    test('should return 201 and create a new user', async () => {
        const userData = { email: 'test@example.com', password: 'password', role: 'USER' };
        const roleData: Role = { id: 2, name: 'USER' }

        const response = await axios.post('http://localhost:3000/auth/register', userData);

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data.email).toBe(userData.email);
        expect(response.data.role_id).toBe(roleData.id);
    });

    test('should return 400 trying to register an user with empty email ', async () => {
        const userData = { email: '', password: 'password', role: 'USER' };

        try {
            const response = await axios.post('http://localhost:3000/auth/register', userData);
        } catch (error: unknown) {
            expect((error as AxiosError).isAxiosError).toBeTruthy();
            expect((error as AxiosError).response?.status).toBe(400);
        }
    });

    test('should return 400 trying to register an user with empty password', async () => {
        const userData = { email: 'test2@example.com', password: 'password', role: 'INVALID' };

        try {
            const response = await axios.post('http://localhost:3000/auth/register', userData);
        } catch (error: unknown) {
            expect((error as AxiosError).isAxiosError).toBeTruthy();
            expect((error as AxiosError).response?.status).toBe(400);
        }
    });

    test('should return 400 trying to register an user with invalid role', async () => {
        const userData = { email: 'test2@example.com', password: '', role: 'USER' };

        try {
            const response = await axios.post('http://localhost:3000/auth/register', userData);
        } catch (error: unknown) {
            expect((error as AxiosError).isAxiosError).toBeTruthy();
            expect((error as AxiosError).response?.status).toBe(400);
        }
    });

    test('should return 400 trying to register an user with email already registered ', async () => {
        const userData = { email: 'emailAlreadyExists@example.com', password: 'password', role: 'USER' };

        try {
            const response = await axios.post('http://localhost:3000/auth/register', userData);
        } catch (error: unknown) {
            expect((error as AxiosError).isAxiosError).toBeTruthy();
            expect((error as AxiosError).response?.status).toBe(400);
        }
    });
});
