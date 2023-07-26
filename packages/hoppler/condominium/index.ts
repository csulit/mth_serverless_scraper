import { env } from "../../../utils/env";
import postgres from "postgres";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  const pgsql = postgres({
    host: env.PG_DATABASE_HOST,
    port: Number(env.PG_DATABASE_PORT),
    user: env.PG_DATABASE_USER,
    password: env.PG_DATABASE_PASS,
    database: env.PG_DATABASE_NAME,
    ssl: env.PG_SSL_MODE === "require" ? "prefer" : false,
  });

  try {
    const user = await pgsql`select * from user`;

    return {
      statusCode: 200,
      body: {
        args,
        user: user.length ? user[0] : user.length,
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
