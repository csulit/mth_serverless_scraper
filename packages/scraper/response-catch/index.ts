// import { mongodbClient } from "../../../utils/mongodb";
import { env } from "../../../utils/env";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
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

  try {
    // const mongodb = await mongodbClient.connect();
    // const db = mongodb.db("mth");

    // const scraper_api_scrape_data = db.collection("scraper_api_scrape_data");

    // const persist = await scraper_api_scrape_data.insertOne(args);

    return {
      statusCode: 200,
      body: {
        // ack: persist.acknowledged,
        // documentId: persist.insertedId,
        env,
      },
    };
  } catch (error) {
    return {
      statusCode: error?.status ?? 500,
      body: {
        error,
      },
    };
  }
}
