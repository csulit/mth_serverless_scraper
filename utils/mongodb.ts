import { MongoClient, type MongoClientOptions } from "mongodb";
import { env } from "./env";

const url = env.MONGO_DATABASE_URL;

const options: MongoClientOptions = {
  maxPoolSize: 10,
  ssl: true,
};

export const mongodbClient = new MongoClient(url, options);
