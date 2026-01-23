const { DataSource } = require('typeorm');
const OpenAI = require('openai'); // Mock if needed

const ds = new DataSource({
    type: 'better-sqlite3',
    database: 'autoseo.sqlite',
});

async function run() {
    await ds.initialize();

    // Pick an article
    const article = (await ds.query('SELECT * FROM articles LIMIT 1'))[0];
    if (!article) { console.log('No articles'); return; }

    console.log('Original Length:', article.content_raw ? article.content_raw.length : 0);

    // Simulate Optimizer
    const content = article.content_raw || "<h1>Empty</h1>";
    const processed = content + '\n\n<p><em>[Updated MANUALLY]</em></p>';

    // Update
    await ds.query('UPDATE articles SET content = ?, status = ? WHERE id = ?', [processed, 'PUBLISHED', article.id]);
    console.log('Updated article:', article.id);
    process.exit(0);
}

run().catch(console.error);
