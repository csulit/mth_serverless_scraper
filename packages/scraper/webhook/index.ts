import { collectProperties } from "../../../utils/collectProperties";
import wretch from "wretch";
import { env } from "../../../utils/env";
import { z } from "zod";
import { mongodbClient } from "../../../utils/mongodb";

const headerConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

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

  const properties = ["urlToScrape", "webhookUrl"];

  const params = collectProperties(args, properties);

  const schema = z.object({
    urlToScrape: z
      .string({
        description: "The URL to scrape",
        required_error: "URL to scrape is required",
        invalid_type_error: "URL to scrape must be a string",
      })
      .url({
        message: "URL to scrape must be a valid URL",
      }),
    webhookUrl: z
      .string({
        description: "The webhook URL",
        required_error: "Webhook URL is required",
        invalid_type_error: "Webhook URL must be a string",
      })
      .url({
        message: "Webhook URL must be a valid URL",
      }),
  });

  try {
    const mongodb = await mongodbClient.connect();
    const db = mongodb.db("mth");
    const query = await schema.safeParseAsync(params);

    const collectionExists = await db
      .listCollections({ name: "scraper_api" })
      .hasNext();

    if (!collectionExists) {
      await db.createCollection("scraper_api");
    }

    if (!query.success) {
      return {
        statusCode: 400,
        body: {
          success: false,
          statusCode: 400,
          data: null,
          message: query.error.errors[0]?.message,
        },
      };
    }

    const { urlToScrape, webhookUrl } = query.data;

    const data = {
      apiKey: env.SCRAPER_API_KEY,
      url: urlToScrape,
      callback: {
        type: "webhook",
        url: webhookUrl,
      },
    };

    const response = await wretch(env.SCRAPER_API_JOBS_URL)
      .headers(headerConfig.headers)
      .post(data)
      .badRequest((error) => error)
      .unauthorized((error) => error)
      .json();

    return {
      statusCode: 200,
      body: {
        statusCode: 200,
        data: response,
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
