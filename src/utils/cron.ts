import cron from "node-cron";
import { cleanupExpiredTokens } from "./tokenCleanup.js";

// Every 10 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("⏳ Running token cleanup...");
  await cleanupExpiredTokens();
});
