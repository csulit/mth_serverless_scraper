import { env } from "../../../utils/env";
import * as postgres from "postgres";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  const pgsql = postgres({
    host: env.PG_DATABASE_HOST,
    port: Number(env.PG_DATABASE_PORT),
    user: env.PG_DATABASE_USER,
    password: env.PG_DATABASE_PASS,
    database: env.PG_DATABASE_NAME,
    ssl: env.PG_SSL_MODE === "require" ? true : false,
  });

  try {
    const foo = await pgsql`select * from pg_catalog.pg_tables`;

    return {
      statusCode: 200,
      body: {
        env,
        args,
        foo,
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
