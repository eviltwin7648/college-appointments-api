import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let mongoReplSet: MongoMemoryReplSet;

beforeAll(async () => {
  // Create a MongoDB replica set with 1 primary and 1 secondary
  mongoReplSet = await MongoMemoryReplSet.create({
    replSet: { count: 2, storageEngine: 'wiredTiger' }
  });
  
  const mongoUri = mongoReplSet.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoReplSet?.stop();
});