import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const isProduction = process.env.NODE_ENV === 'production';
if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long.');
}

const frontendOrigin = process.env.FRONTEND_ORIGIN || (isProduction ? '' : 'http://localhost:5173');
if (!frontendOrigin) {
  throw new Error('FRONTEND_ORIGIN is required in production.');
}

if (isProduction) {
  let parsedOrigin;
  try {
    parsedOrigin = new URL(frontendOrigin);
  } catch {
    throw new Error('FRONTEND_ORIGIN must be a valid HTTPS origin in production.');
  }
  if (parsedOrigin.protocol !== 'https:' || parsedOrigin.origin !== frontendOrigin) {
    throw new Error('FRONTEND_ORIGIN must be an HTTPS origin without a path in production.');
  }
}

export const config = {
  mongoUri: process.env.MONGODB_URI,
  mongoDbName: 'techfestdb',
  jwtSecret: process.env.JWT_SECRET,
  frontendOrigin,
  port: Number(process.env.PORT) || 5000,
  isProduction,
};
