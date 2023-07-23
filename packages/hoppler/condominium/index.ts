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
    const user = await pgsql`select * from user`;

    return {
      statusCode: 200,
      body: {
        env,
        args,
        pg: user.length > 0 ? user[0] : null,
      },
    };
  } catch (error) {
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
