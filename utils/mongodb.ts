import { MongoClient } from "mongodb";
import { env } from "./env";

const url = env.MONGO_DATABASE_URL;
export const mongodbClient = new MongoClient(url);
