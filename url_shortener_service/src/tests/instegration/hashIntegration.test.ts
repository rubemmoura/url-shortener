import axios from 'axios';
import UrlMapperRepository from '../../repositories/urlMapperRepository';
import KnexSingleton from './database/knexSingletonTest';

describe('GET /:hash', () => {
    const urlMapperRepository = new UrlMapperRepository(KnexSingleton);

    beforeAll(async () => {

    });

    afterAll(async () => {

    });

    test('should return 200 if access correct hash', async () => {
        const urlMapper = await urlMapperRepository.getUrlMapperItemById(1);
        const responseHash = await axios.get(`http://localhost:3001/${urlMapper.hash}`);

        expect(responseHash.status).toBe(200);
    });
});
