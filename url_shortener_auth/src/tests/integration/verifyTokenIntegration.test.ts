import axios, { AxiosError } from 'axios';
import UserRepository from '../../repositories/userRepository';
import knexSingleton from './database/knexSingletonTest';

describe('POST /verify-token', () => {
    const userRepository = new UserRepository(knexSingleton);
    beforeAll(async () => {
        await Promise.all([
            userRepository.createUser({ email: 'test-verify-token@example.com', password: 'password', role_id: 1 })
        ]);
    });

    afterAll(async () => {
        await Promise.all([
            userRepository.deleteUserByEmail('test-verify-token@example.com'),
        ]);
    });

    test('should return 200 for an user loged in', async () => {
        const payloadData = { email: 'test-verify-token@example.com', password: 'password' };

        const response = await axios.post('http://localhost:3000/auth/login', payloadData);

        const token = response.data.token;

        const responseVerifyToken = await axios.post('http://localhost:3000/auth/verify-token', { token });

        expect(responseVerifyToken.status).toBe(200);
        expect(responseVerifyToken.data).toHaveProperty('decoded');
        expect(responseVerifyToken.data.decoded).toHaveProperty('email');
        expect(responseVerifyToken.data.decoded.email).toBe('test-verify-token@example.com');
    });

    test('should return 401 trying to verify token with invalid token', async () => {
        const token = { token: 'invalid' };

        try {
            const response = await axios.post('http://localhost:3000/auth/verify-token', token);
        } catch (error: unknown) {
            expect((error as AxiosError).isAxiosError).toBeTruthy();
            expect((error as AxiosError).response?.status).toBe(401);
        }
    });

    // test('should return 400 trying to login an user with empty password ', async () => {
    //     const userData = { email: 'test@example.com', password: '' };

    //     try {
    //         const response = await axios.post('http://localhost:3000/auth/login', userData);
    //     } catch (error: unknown) {
    //         expect((error as AxiosError).isAxiosError).toBeTruthy();
    //         expect((error as AxiosError).response?.status).toBe(400);
    //     }
    // });

    // test('should return 401 trying to login an user with email invalid credential ', async () => {
    //     const userData = { email: 'test-invalid@example.com', password: 'password' };

    //     try {
    //         const response = await axios.post('http://localhost:3000/auth/login', userData);
    //     } catch (error: unknown) {
    //         expect((error as AxiosError).isAxiosError).toBeTruthy();
    //         expect((error as AxiosError).response?.status).toBe(401);
    //     }
    // });

    // test('should return 401 trying to login an user with password invalid credential ', async () => {
    //     const userData = { email: 'test@example.com', password: 'invalid' };

    //     try {
    //         const response = await axios.post('http://localhost:3000/auth/login', userData);
    //     } catch (error: unknown) {
    //         expect((error as AxiosError).isAxiosError).toBeTruthy();
    //         expect((error as AxiosError).response?.status).toBe(401);
    //     }
    // });
});
