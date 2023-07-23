import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

export const environment = createEnv({
  server: {
    SCRAPER_API_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
});
