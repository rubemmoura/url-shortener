import Knex from 'knex';

class KnexSingleton {
    private static instance: typeof Knex | any = null;

    private constructor() { }

    public static getInstance(): typeof Knex {
        if (!KnexSingleton.instance) {
            const knexConfig = {
                client: 'pg',
                connection: {
                    host: 'host.docker.internal',
                    port: '5432',
                    user: 'admin',
                    password: 'admin_password',
                    database: 'url_shortener_db_service',
                },
            };
            KnexSingleton.instance = Knex(knexConfig);
        }
        return KnexSingleton.instance;
    }
}

export default KnexSingleton.getInstance();
