const cron = require("node-cron");
const Upload = require("../models/Upload");

cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    const result = await Upload.deleteMany({
      expiresAt: { $lt: now },
    });

    if (result.deletedCount > 0) {
      console.log(`🧹 Deleted ${result.deletedCount} expired uploads`);
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});
