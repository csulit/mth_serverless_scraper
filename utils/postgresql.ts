import * as postgres from "postgres";
import { env } from "./env";

const pgsql = postgres({
  host: env.PG_DATABASE_HOST,
  user: env.PG_DATABASE_USER,
  password: env.PG_DATABASE_PASS,
  database: env.PG_DATABASE_NAME,
  ssl: env.PG_SSL_MODE === "require" ? true : false,
});

export default pgsql;
