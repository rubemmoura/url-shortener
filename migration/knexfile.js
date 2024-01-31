module.exports = {
    auth: {
        client: 'pg',
        connection: {
            host: 'postgres-db-auth',
            port: 5432,
            user: 'admin',
            password: 'admin_password',
            database: 'url_shortener_db_auth',
        },
        migrations: {
            directory: './scripts/auth',
        },
        seeds: {
            directory: './seeds',
        },
    },
    service: {
        client: 'pg',
        connection: {
            host: 'postgres-db-service',
            port: 5432,
            user: 'admin',
            password: 'admin_password',
            database: 'url_shortener_db_service',
        },
        migrations: {
            directory: './scripts/service',
        },
        seeds: {
            directory: './seeds',
        },
    },
};
