import env from "dotenv";

if (process.env.NODE_ENV !== "production") {
  env.config({ path: ".env.development" });
}
env.config();
