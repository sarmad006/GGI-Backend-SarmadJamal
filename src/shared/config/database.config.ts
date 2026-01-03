function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const DatabaseConfig = {
  host: required('DATABASE_HOST'),
  port: Number(required('DATABASE_PORT')),
  user: required('DATABASE_USER'),
  password: required('DATABASE_PASSWORD'),
  database: required('DATABASE_NAME'),
};
