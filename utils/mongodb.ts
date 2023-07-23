import { MongoClient } from "mongodb";
import { env } from "./env";

const url = env.MONGO_DATABASE_URL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10, // set the maximum number of connections in the pool
  serverSelectionTimeoutMS: 5000, // set the timeout for selecting a server
};

export const mongodbClient = new MongoClient(url, options);
