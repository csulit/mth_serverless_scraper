import { env } from "../../../utils/env";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  try {
    return {
      statusCode: 200,
      body: {
        env,
        args,
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
