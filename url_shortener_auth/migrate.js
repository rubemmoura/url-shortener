const knex = require('knex');
const knexConfig = require('./knexfile');

async function runMigrations() {
    try {
        const db = knex(knexConfig.development);

        await db.migrate.latest();
        console.log('Migrations ran successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    }
}

runMigrations();
