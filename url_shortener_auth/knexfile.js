module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5433,
            user: 'admin',
            password: 'admin_password',
            database: 'url_shortener_db_auth',
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
};
