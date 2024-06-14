import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI; // Replace with your MongoDB connection string

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedDb: any = null;

const startDb = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  await mongoose.connect(uri);

  cachedDb = mongoose.connection;
  return cachedDb;
};
export default startDb;
