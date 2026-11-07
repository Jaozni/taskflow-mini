const { loadEnvironment } = require('./config/env');
const { createDatabase } = require('./database');
const { createApp } = require('./app');

function startServer() {
  const environment = loadEnvironment();
  const database = createDatabase(environment.databasePath);
  const app = createApp(database);

  return app.listen(environment.port, () => {
    console.log(`Servidor executando na porta ${environment.port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  startServer
};
