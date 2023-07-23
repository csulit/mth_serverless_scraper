import { MongoClient } from "mongodb";
import { env } from "./env";

const url = env.MONGODB_CONNECTION_STRING;
export const mongodbClient = new MongoClient(url);
