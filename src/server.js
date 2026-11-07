const createApp = require('./app');
const { initializeDatabase } = require('./database/connection');

const port = Number(process.env.PORT) || 3000;

try {
  initializeDatabase();
} catch (error) {
  console.error('Falha ao inicializar o banco de dados:', error.message);
  process.exit(1);
}

const app = createApp();

app.listen(port, () => {
  console.log(`TaskFlow Mini executando na porta ${port}`);
});
