const { createApp } = require('./app');
const { createDatabase } = require('./database');

const PORT = process.env.PORT || 3000;
const DATABASE_PATH = process.env.DATABASE_PATH || './data/taskflow.db';

const database = createDatabase(DATABASE_PATH);
const app = createApp(database);

app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}`);
});
