import { MongoClient } from "mongodb";
import { env } from "../../../utils/env";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function main(args: Record<string, any>) {
  if (args.http.method !== "POST") {
    return {
      statusCode: 405,
      body: {
        success: false,
        statusCode: 405,
        data: null,
        message: "Method not allowed",
      },
    };
  }

  const url = env.MONGO_DATABASE_URL;

  const mongodbClient = new MongoClient(url);

  try {
    await mongodbClient.connect();

    const scraper_api_scrape_data = mongodbClient
      .db("mth")
      .collection("scraper_api_scrape_data");

    const persist = await scraper_api_scrape_data.insertOne(args);

    return {
      statusCode: 200,
      body: {
        success: true,
        data: persist,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: error?.status ?? 500,
      body: {
        error,
      },
    };
  } finally {
    await mongodbClient.close();
  }
}

export default main;
