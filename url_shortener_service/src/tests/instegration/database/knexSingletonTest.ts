import knex, { Knex } from 'knex';

class KnexSingletonTest {
    private static instance: Knex<any, any> | null = null;

    private constructor() { }

    public static getInstance(): Knex<any, any> {
        if (!KnexSingletonTest.instance) {
            const knexConfig = {
                client: 'pg',
                connection: {
                    host: 'localhost',
                    port: '5432',
                    user: 'admin',
                    password: 'admin_password',
                    database: 'url_shortener_db_service',
                },
            };
            KnexSingletonTest.instance = knex(knexConfig);
        }
        if (!KnexSingletonTest.instance) {
            throw new Error('Knex instance was not created properly');
        }
        return KnexSingletonTest.instance;
    }
}

export default KnexSingletonTest.getInstance(); // Exporta a instância do Knex
