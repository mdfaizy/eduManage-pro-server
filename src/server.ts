import dotenv from "dotenv";
dotenv.config();
import "dotenv/config";

import "./utils/cron.js"; 
import app from "./app.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
