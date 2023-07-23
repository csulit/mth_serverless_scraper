//import { mongodbClient } from "../../../utils/mongodb";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  try {
    // const mongodb = await mongodbClient.connect();
    // const db = mongodb.db("mth");

    // const scraper_api_scrape_data = db.collection("scraper_api_scrape_data");

    //scraper_api_scrape_data.insertOne(args);

    return {
      statusCode: 200,
      body: args,
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
