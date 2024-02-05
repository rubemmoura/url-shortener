import knex, { Knex } from 'knex';

class KnexSingleton {
    private static instance: Knex<any, any> | null = null;

    private constructor() { }

    public static getInstance(): Knex<any, any> {
        if (!KnexSingleton.instance) {
            const knexConfig = {
                client: 'pg',
                connection: {
                    host: 'postgres-db-service',
                    port: '5432',
                    user: 'admin',
                    password: 'admin_password',
                    database: 'url_shortener_db_service',
                },
            };
            KnexSingleton.instance = knex(knexConfig);
        }
        if (!KnexSingleton.instance) {
            throw new Error('Knex instance was not created properly');
        }
        return KnexSingleton.instance;
    }
}

export default KnexSingleton.getInstance();
