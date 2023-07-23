import { collectProperties } from "../../../utils/collectProperties";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function main(args: Record<string, any>) {
  const properties = ["foo", "doo"];

  const params = collectProperties(args, properties);

  return {
    statusCode: 200,
    body: {
      params,
    },
  };
}
