const db = require('../config/database');

const run = (query) => {
  return new Promise((resolve, reject) => {
    db.run(query, function (err) {
      if (err) {
        console.error('Error running SQLite query:', err.message);
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
};

const initDb = async () => {
  const enableForeignKeys = `PRAGMA foreign_keys = ON;`;
  
  try {
    // We must run pragmas strictly outside of promises or explicitly wrap them if needed. 
    // Usually it is better to enable pragmas inside the db connection in database.js for the app, 
    // but here we execute it for schema creation as well.
    await run(enableForeignKeys);

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createEventosTable = `
      CREATE TABLE IF NOT EXISTS listas_eventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        maximo_convidados INTEGER NOT NULL,
        maximo_acompanhantes_por_convidado INTEGER DEFAULT 0,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
      );
    `;

    const createConvidadosTable = `
      CREATE TABLE IF NOT EXISTS convidados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lista_evento_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL,
        confirmado BOOLEAN DEFAULT 0,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lista_evento_id) REFERENCES listas_eventos(id) ON DELETE CASCADE
      );
    `;

    const createAcompanhantesTable = `
      CREATE TABLE IF NOT EXISTS acompanhantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        convidado_id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (convidado_id) REFERENCES convidados(id) ON DELETE CASCADE
      );
    `;

    await run(createUsersTable);
    console.log('Database initialized: usuarios table is ready.');

    await run(createEventosTable);
    console.log('Database initialized: listas_eventos table is ready.');

    await run(createConvidadosTable);
    console.log('Database initialized: convidados table is ready.');

    await run(createAcompanhantesTable);
    console.log('Database initialized: acompanhantes table is ready.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  } finally {
    // Optionally close db connection after init script if run independently
    // db.close();
  }
};

// Execute if run straight from command line
if (require.main === module) {
  initDb().then(() => db.close());
}

module.exports = initDb;
