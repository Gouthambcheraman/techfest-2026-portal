import mongoose from 'mongoose';
import { config } from './config.js';
import Feedback from './models/Feedback.js';
import User from './models/User.js';

const requiredCollections = ['users', 'feedback'];
const legacyCollection = 'user';

async function collectionExists(db, name) {
  return db.listCollections({ name }, { nameOnly: true }).hasNext();
}

async function ensureCollection(db, name) {
  if (await collectionExists(db, name)) {
    return;
  }

  try {
    await db.createCollection(name);
  } catch (error) {
    if (error?.code !== 48 || !(await collectionExists(db, name))) {
      throw error;
    }
  }
}

export async function initializeDatabase(db = mongoose.connection.db) {
  if (!db || db.databaseName !== config.mongoDbName) {
    throw new Error(`Database initialization requires the ${config.mongoDbName} database.`);
  }

  if (await collectionExists(db, legacyCollection)) {
    const documentCount = await db.collection(legacyCollection).countDocuments({});
    if (documentCount > 0) {
      throw new Error(`Legacy collection "${legacyCollection}" contains ${documentCount} documents; initialization stopped without deleting it.`);
    }
    await db.dropCollection(legacyCollection);
  }

  for (const name of requiredCollections) {
    await ensureCollection(db, name);
  }

  await Promise.all([User.init(), Feedback.init()]);
}
