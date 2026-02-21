import dotenv from 'dotenv';

dotenv.config();

const required = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};
