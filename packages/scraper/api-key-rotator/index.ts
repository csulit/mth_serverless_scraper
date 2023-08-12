import postgres from "postgres";
import { env } from "../../../utils/env";
import { collectProperties } from "../../../utils/collectProperties";
import { z } from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  if (args.http.method !== "GET") {
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

  const properties = ["apiKey"];

  const params = collectProperties(args, properties);

  const schema = z.object({
    apiKey: z.string().min(1),
  });

  try {
    const validatedData = await schema.safeParseAsync(params);

    if (!validatedData.success) {
      return {
        statusCode: 400,
        body: {
          error: "Bad Request",
        },
      };
    }

    const apiKey = await pgsql`select api_key 
      from scraper_api_key 
      where credits < 999 
      order by api_key_id desc limit 1`;

    if (apiKey.length) {
      return {
        statusCode: 200,
        body: {
          apiKey: apiKey.at(0)?.api_key,
        },
      };
    }

    return {
      statusCode: 200,
      body: {
        apiKey: null,
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
