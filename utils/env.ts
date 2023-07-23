import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

export const env = createEnv({
  server: {
    SCRAPER_API_JOBS_URL: z.string().url(),
    SCRAPER_API_KEY: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
});
