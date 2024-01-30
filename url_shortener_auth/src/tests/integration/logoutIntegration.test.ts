import axios, { AxiosError } from 'axios';
import UserRepository from '../../repositories/userRepository';
import knexSingleton from './database/knexSingletonTest';

describe('POST /logout', () => {
    const userRepository = new UserRepository(knexSingleton);
    beforeAll(async () => {
        await Promise.all([
            userRepository.createUser({ email: 'testLogout@example.com', password: 'password', role_id: 1 })
        ]);
    });

    afterAll(async () => {
        await Promise.all([
            userRepository.getUserByEmail('testLogout@example.com'),
            userRepository.deleteUserByEmail('testLogout@example.com'),
        ]);
    });

    test('should return 200 for a valid token user loged in', async () => {
        const payloadData = { email: 'testLogout@example.com', password: 'password' };

        const loginResponse = await axios.post('http://localhost:3000/auth/login', payloadData);

        const token = loginResponse.data.token

        const logoutResponse = await axios.post('http://localhost:3000/auth/logout', { token });

        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.data).toHaveProperty('blackListItem');
    });

    test('should return 400 trying to logout an user with empty token ', async () => {
        const payloadData = { token: '' };

        try {
            const response = await axios.post('http://localhost:3000/auth/logout', payloadData);
        } catch (error: unknown) {
            expect((error as AxiosError).isAxiosError).toBeTruthy();
            expect((error as AxiosError).response?.status).toBe(400);
        }
    });
});
