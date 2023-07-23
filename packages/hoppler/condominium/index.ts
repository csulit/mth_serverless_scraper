import { env } from "../../../utils/env";
import pgsql from "../../../utils/postgresql";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  try {
    const foo = pgsql.name;

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
