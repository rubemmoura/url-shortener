import Knex from 'knex';

class KnexSingletonTest {
    private static instance: typeof Knex | any = null;

    private constructor() { }

    public static getInstance(): typeof Knex {
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
            KnexSingletonTest.instance = Knex(knexConfig);
        }
        return KnexSingletonTest.instance;
    }
}

export default KnexSingletonTest.getInstance();
