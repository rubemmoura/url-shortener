import axios from 'axios';

describe('POST /shorten', () => {
    let token: string;

    beforeAll(async () => {
        const userData = {
            "email": "testUser@gmail.com",
            "password": "password",
            "role": "ADMIN"
        };

        try {
            await axios.post('http://localhost:3000/auth/register', userData);
        } catch (error) {
            console.log(error)
        }

        const payloadLoginData = {
            "email": "testUser@gmail.com",
            "password": "password"
        };

        try {
            const loginResponse = await axios.post('http://localhost:3000/auth/login', payloadLoginData);
            token = loginResponse.data.token;
        } catch (error) {
            console.log(error)
        }
    });

    afterAll(async () => {
        const payloadDeleteUser = {
            "email": "testUser@gmail.com"
        };

        await axios.delete('http://localhost:3000/auth/delete', { data: payloadDeleteUser });
    });

    test('should return 201 if a new short URL is created', async () => {
        const headers = {
            Authorization: `${token}`
        };

        const responseShorten = await axios.post('http://localhost:3001/shorten', { url: 'https://example.com' }, { headers });

        expect(responseShorten.status).toBe(201);
        expect(responseShorten.data).toHaveProperty('shortUrl');
    });
});
