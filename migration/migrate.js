const knex = require('knex');
const knexConfig = require('./knexfile');

async function runMigrations() {
    try {
        let db = knex(knexConfig.auth);
        await db.migrate.latest();
        console.log('Auth db migrations ran successfully');

        db = knex(knexConfig.service);
        await db.migrate.latest();
        console.log('Service db migrations ran successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    }
}

runMigrations();
