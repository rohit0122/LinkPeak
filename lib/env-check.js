const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "SITE_URL",
  "NODEMAILER_HOST",
  "NODEMAILER_PORT",
  "NODEMAILER_USER",
  "NODEMAILER_PASS",
  "NODEMAILER_USER_SENDER",
];

export function checkEnv() {
  const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.warn(
      `[WARNING] Missing environment variables: ${missing.join(", ")}`
    );
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `CRITICAL: Missing required environment variables for production: ${missing.join(
          ", "
        )}`
      );
    }
  }
}
