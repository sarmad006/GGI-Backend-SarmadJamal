import { Pool } from 'pg';
import { DatabaseConfig } from '../config';

export const pool = new Pool({
  host: DatabaseConfig.host,
  port: DatabaseConfig.port,
  user: DatabaseConfig.user,
  password: DatabaseConfig.password,
  database: DatabaseConfig.database,
});
