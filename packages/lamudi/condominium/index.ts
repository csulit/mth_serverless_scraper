import { load } from "cheerio";
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

  const PROPERTY_TYPES = {
    Condominium: 1,
    House: 2,
    Townhouse: 3,
    VacantLot: 4,
    Apartment: 5,
  };

  const LISTING_TYPES = {
    ForSale: 1,
    ForRent: 2,
  };

  const TURNOVER_STATUS = {
    FullyFurnished: 1,
    SemiFurnished: 2,
    Unfurnished: 3,
    Unknown: 4,
  };

  const UNKNOWN_CITY = 1700;

  const PROPERTY_STATUS_UNTAGGED = 4;

  try {
    const data: {
      href: string;
      title: string;
      address: string;
      unstructuredMetadata: Record<string, unknown>;
    }[] = [];

    const condominium =
      await pgsql`select html_data from scraper_api_data where scrape_url 
      like '%https://www.lamudi.com.ph/condominium%' limit 1`;

    if (condominium.length) {
      condominium.forEach((condo) => {
        const $ = load(condo.html_data);
        $(".card").each((_index, element) => {
          const href = $(element).find(".js-listing-link").attr("href");
          const title = $(element)
            .find(".ListingCell-KeyInfo-title")
            .attr("title");
          const address = $(element)
            .find(".ListingCell-KeyInfo-address-text")
            .text()
            .trim();
          const unstructuredMetadata = $(element)
            .find(".ListingCell-AllInfo")
            .data();
          if (href && title) {
            data.push({
              href,
              title,
              address,
              unstructuredMetadata,
            });
          }
        });
      });

      data.forEach(async (item) => {
        const condominiumExists =
          await pgsql`select * from property where listing_url = ${item.href}`;

        if (condominiumExists.length) {
          return;
        }

        await pgsql`insert into property (
            listing_title, 
            listing_url, 
            property_type_id, 
            listing_type_id, 
            property_status_id, 
            turnover_status_id, 
            current_price, 
            year_built, 
            city_id, 
            address,
            longitude,
            latitude,
            data_source,
            unstructured_metadata
          ) values (
            ${item.title},
            ${item.href},
            ${PROPERTY_TYPES.VacantLot},
            ${LISTING_TYPES.ForRent},
            ${PROPERTY_STATUS_UNTAGGED},
            ${TURNOVER_STATUS.Unknown},
            ${
              item?.unstructuredMetadata?.price
                ? (parseFloat(
                    item.unstructuredMetadata.price.toString()
                  ) as number)
                : 0
            },
            ${
              item?.unstructuredMetadata?.yearBuilt
                ? (item.unstructuredMetadata.yearBuilt as number)
                : null
            },
            ${UNKNOWN_CITY},
            ${
              item?.unstructuredMetadata?.address
                ? (item.unstructuredMetadata.address as string)
                : "N/A"
            },
            ${
              item?.unstructuredMetadata?.geoPoint
                ? item.unstructuredMetadata.geoPoint[0]
                : null
            },
            ${
              item?.unstructuredMetadata?.geoPoint
                ? item.unstructuredMetadata.geoPoint[1]
                : null
            },
            'Lamudi',
            ${JSON.stringify(item)}
          )`;
      });
    }

    return {
      statusCode: 200,
      body: "OK",
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
