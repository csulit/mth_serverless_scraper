import { MongoClient } from "mongodb";
import { env } from "./env";

const url = env.DATABASE_URL;
export const mongodbClient = new MongoClient(url);
