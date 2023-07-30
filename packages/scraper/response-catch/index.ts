/* eslint-disable @typescript-eslint/no-explicit-any */
async function main(args: Record<string, any>) {
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

  try {
    return {
      statusCode: 200,
      body: {
        success: true,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: error?.status ?? 500,
      body: {
        error,
      },
    };
  }
}

export default main;
