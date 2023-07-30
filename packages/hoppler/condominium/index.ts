import { env } from "../../../utils/env";
import postgres from "postgres";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  const pgsql = postgres({
    host: env.PG_DATABASE_HOST,
    port: Number(env.PG_DATABASE_PORT),
    database: env.PG_DATABASE_NAME,
    user: env.PG_DATABASE_USER,
    password: env.PG_DATABASE_PASS,
    ssl: env.PG_SSL_MODE === "require" ? "prefer" : false,
  });

  try {
    const property_status = await pgsql`select * from property_status`;

    return {
      statusCode: 200,
      body: {
        args,
        property_status: property_status[0],
      },
    };
  } catch (error) {
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
