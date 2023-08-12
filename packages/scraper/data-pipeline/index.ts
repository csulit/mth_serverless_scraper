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

  const properties = ["input", "result"];

  const data = collectProperties(args, properties);

  const schema = z.object({
    input: z.string().url(),
    result: z.string().min(1),
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

    const SCRAPER_API_STATUS = "finished";

    await pgsql`insert into scraper_api_data (
      html_data, 
      scraper_api_status, 
      scrape_url
    ) 
    values (
      ${validatedData.data.result},
      ${SCRAPER_API_STATUS},
      ${validatedData.data.input}
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
