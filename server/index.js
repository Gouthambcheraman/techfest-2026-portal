import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';
import { config } from './config.js';
import { initializeDatabase } from './database.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? mongoose.connection.db.databaseName : 'disconnected',
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use((error, _req, res, _next) => {
  console.error('API error:', error);
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ message: 'Request body must be valid JSON.' });
  }
  return res.status(500).json({ message: 'An unexpected server error occurred.' });
});

try {
  await mongoose.connect(config.mongoUri, { dbName: config.mongoDbName });
  await initializeDatabase();
  app.listen(config.port, () => {
    console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
    console.log('Database collections initialized: users, feedback');
    console.log(`TechFest API listening on http://localhost:${config.port}`);
  });
} catch (error) {
  console.error('Could not connect to MongoDB:', error);
  process.exitCode = 1;
}
