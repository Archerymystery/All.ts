import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env' });
export const env = z.object({
  TOKEN: z.string()
}).parse(process.env)
