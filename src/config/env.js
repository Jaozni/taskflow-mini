function loadEnvironment(processEnv = process.env) {
  const port = Number(processEnv.PORT || 3000);
  const databasePath = processEnv.DATABASE_PATH || './data/tasks.db';

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('A variável PORT deve ser um inteiro entre 1 e 65535');
  }

  if (typeof databasePath !== 'string' || databasePath.trim() === '') {
    throw new Error('A variável DATABASE_PATH deve ser um caminho válido');
  }

  return {
    port,
    databasePath
  };
}

module.exports = {
  loadEnvironment
};
