import dotenv from "dotenv";
dotenv.config();

const ENV_ENUM = {
  PRODUCTION: "production",
  DEV: "development",
};

const env = {
  PORT: process.env.PORT || 8000,
  isProdEnv: process.env.NODE_ENV === ENV_ENUM.PRODUCTION,
};

export { env };
