import { mongodbClient } from "../../../utils/mongodb";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  try {
    const mongodb = await mongodbClient.connect();
    const db = mongodb.db("mth");

    const test = await db.collection("scraper_api_scrape_data").findOne({});

    return {
      statusCode: 200,
      body: {
        test,
        args,
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
