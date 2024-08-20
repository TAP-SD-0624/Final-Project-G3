import { magenta } from 'colorette';

const dbLogger = (message: string): void => {
  // to colorize the logs of the database to differentiate them from the rest of the logs
  console.log(magenta(`[Sequelize]: ${message}`));
};

export default dbLogger;
