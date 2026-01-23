const { DataSource } = require('typeorm');

const ds = new DataSource({
    type: 'better-sqlite3',
    database: 'test-typeorm.db',
    synchronize: true
});

ds.initialize()
    .then(() => {
        console.log('TypeORM Success');
        process.exit(0);
    })
    .catch(e => {
        console.error('TypeORM Error:', e);
        process.exit(1);
    });
