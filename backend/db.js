const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance;

async function init() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        period TEXT,
        price INTEGER,
        number INTEGER,
        result TEXT
      );
    `);
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY,
        balance INTEGER
      );
    `);
    const user = await dbInstance.get('SELECT * FROM user WHERE id=1');
    if (!user) {
      await dbInstance.run('INSERT INTO user (id, balance) VALUES (1, 11710)');
    }
  }
  return dbInstance;
}

module.exports = {
  all: async (...args) => {
    const db = await init();
    return db.all(...args);
  },
  get: async (...args) => {
    const db = await init();
    return db.get(...args);
  },
  run: async (...args) => {
    const db = await init();
    return db.run(...args);
  }
};
