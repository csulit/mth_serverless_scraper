import postgres from "postgres";
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

  const pgsql = postgres({
    host: env.PG_DATABASE_HOST,
    port: Number(env.PG_DATABASE_PORT),
    user: env.PG_DATABASE_USER,
    password: env.PG_DATABASE_PASS,
    database: env.PG_DATABASE_NAME,
    ssl: env.PG_SSL_MODE === "require" ? "prefer" : false,
  });

  try {
    const newRow = await pgsql`insert into scraper_api_data (
        html_data,
        scraper_api_status,
        scrape_url
      ) values (
        args.response.body,
        args.status,
        args.url
      ) returning html_data_id`;

    return {
      statusCode: 200,
      body: {
        success: true,
        statusCode: 200,
        newRowId: newRow.length ? newRow[0].html_data_id : null,
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
    await pgsql.end();
  }
}

export default main;
