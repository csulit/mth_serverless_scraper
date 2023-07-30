import postgres from "postgres";
import { env } from "../../../utils/env";
import { collectProperties } from "../../../utils/collectProperties";
import { z } from "zod";

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

  const pgsql = postgres({
    host: env.PG_DATABASE_HOST,
    port: Number(env.PG_DATABASE_PORT),
    database: env.PG_DATABASE_NAME,
    user: env.PG_DATABASE_USER,
    password: env.PG_DATABASE_PASS,
    ssl: env.PG_SSL_MODE === "require" ? "prefer" : false,
  });

  const properties = ["status", "url", "response"];

  const data = collectProperties(args, properties);

  const schema = z.object({
    status: z.string().min(1),
    url: z.string().url(),
    response: z.object({
      body: z.string().min(1),
    }),
  });

  try {
    const validatedData = await schema.safeParseAsync(data);

    if (!validatedData.success) {
      return {
        statusCode: 400,
        body: {
          error: "Bad Request",
        },
      };
    }

    await pgsql`insert into scraper_api_data (
      html_data, 
      scraper_api_status, 
      scrape_url
    ) 
    values (
      ${validatedData.data.response.body},
      ${validatedData.data.status},
      ${validatedData.data.url}
    )`;

    return {
      statusCode: 200,
      body: {
        success: true,
        statusCode: 200,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: error?.status ?? 500,
      body: {
        error: error?.message ?? "Internal Server Error",
      },
    };
  } finally {
    await pgsql.end();
  }
}
