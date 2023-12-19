import "./dotenv.config.js";
import { connectDB } from "./src/database/index.js";
import app from "./src/server.js";

(async function () {
  try {
    await connectDB(process.env.DB_URL);
    const PORT = process.env.PORT
    app.listen(PORT, (_) => {
      console.log("Server running on port " + PORT + "...");
    });
  } catch (error) {
    console.log("Database connection not established, server will not run");
  }
})();
