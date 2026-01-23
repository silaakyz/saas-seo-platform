const Database = require('better-sqlite3');
try {
    const db = new Database('test.db', { verbose: console.log });
    db.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)');
    console.log('SQLite works!');
    db.close();
} catch (e) {
    console.error('SQLite failed:', e);
}
