// import { load } from "cheerio";
import postgres from "postgres";
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

  const pgsql = postgres({
    host: env.PG_DATABASE_HOST,
    port: Number(env.PG_DATABASE_PORT),
    database: env.PG_DATABASE_NAME,
    user: env.PG_DATABASE_USER,
    password: env.PG_DATABASE_PASS,
    ssl: env.PG_SSL_MODE === "require" ? "prefer" : false,
  });

  // const PROPERTY_TYPES = {
  //   Condominium: 1,
  //   House: 2,
  //   Townhouse: 3,
  //   VacantLot: 4,
  //   Apartment: 5,
  // };

  // const LISTING_TYPES = {
  //   ForSale: 1,
  //   ForRent: 2,
  // };

  // const TURNOVER_STATUS = {
  //   FullyFurnished: 1,
  //   SemiFurnished: 2,
  //   Unfurnished: 3,
  //   Unknown: 4,
  // };

  // const UNKNOWN_CITY = 1700;

  // const PROPERTY_STATUS_UNTAGGED = 4;

  try {
    // const data: {
    //   href: string;
    //   title: string;
    //   address: string;
    //   unstructuredMetadata: Record<string, unknown>;
    // }[] = [];

    const condominium = await pgsql`select html_data_id, html_data 
        from scraper_api_data
        where scrape_url 
        like '%https://www.lamudi.com.ph/condominium%' limit 10`;

    return {
      statusCode: 200,
      body: {
        kkk: condominium.length ? condominium[0] : "OK",
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
