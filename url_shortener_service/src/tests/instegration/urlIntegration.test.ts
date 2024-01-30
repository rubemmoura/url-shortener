import axios from 'axios';
import UrlMapperRepository from '../../repositories/urlMapperRepository';
import KnexSingleton from './database/knexSingletonTest';
import { UrlMapperItem } from '../../interfaces/urlMapperItem';

describe('GET /analytics/url', () => {
    let token: string;
    const urlMapperRepository = new UrlMapperRepository(KnexSingleton);


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

        const currentDate = new Date().toISOString();

        for (let i = 0; i < 10; i++) {
            const urlMapperItem: UrlMapperItem = {
                longUrl: `https://exampleTest.com/${i}`,
                hash: `hash${i}`,
                createdBy: `user${i}`,
                createdAt: currentDate
            };

            try {
                await urlMapperRepository.createUrlMapperItem(urlMapperItem);
            } catch (error) {
                console.error('Error creating UrlMapperItem:', error);
            }
        }
    });

    afterAll(async () => {
        const payloadDeleteUser = {
            "email": "testUser@gmail.com"
        };

        await axios.delete('http://localhost:3000/auth/delete', { data: payloadDeleteUser });

        for (let i = 0; i < 10; i++) {
            let longUrl = `https://exampleTest.com/${i}`

            try {
                await urlMapperRepository.deleteUrlMapperItemByLongUrl(longUrl);
            } catch (error) {
                console.error('Error deleting UrlMapperItem:', error);
            }
        }
    });

    test('should return 200 if access correct hash', async () => {
        const headers = {
            Authorization: `${token}`
        };

        const responseHash = await axios.get('http://localhost:3001/analytics/url', { headers });

        expect(responseHash.status).toBe(200);
    });

    test('should return 200 if access correct hash', async () => {
        const headers = {
            Authorization: `${token}`
        };

        const response = await axios.get('http://localhost:3001/analytics/url', {
            params: {
                page: '1',
                pageSize: '10',
                longUrlFilter: '',
                createdByFilter: ''
            }, headers
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('urlMapperItems');
        expect(response.data).toHaveProperty('maxItems');
    });
});
