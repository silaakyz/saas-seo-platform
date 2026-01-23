const { DataSource } = require('typeorm');

const ds = new DataSource({
    type: 'better-sqlite3',
    database: 'autoseo.sqlite',
});

async function check() {
    await ds.initialize();
    const articles = await ds.query('SELECT * FROM articles');
    console.log('Articles found:', articles.length);
    console.log(articles);
    process.exit(0);
}

check().catch(console.error);
