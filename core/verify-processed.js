const { DataSource } = require('typeorm');

const ds = new DataSource({
    type: 'better-sqlite3',
    database: 'autoseo.sqlite',
});

async function check() {
    await ds.initialize();
    // Select an article that has content populated
    const articles = await ds.query('SELECT id, length(content) as len, version, status FROM articles WHERE content IS NOT NULL');
    console.log('Processed Articles:', articles.length);
    console.log(articles);
    process.exit(0);
}

check().catch(console.error);
