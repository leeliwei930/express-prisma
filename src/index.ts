import dotenv from "dotenv";
import app from "./server/index";

dotenv.config({
  path: "../.env",
});

// Uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Perform any necessary cleanup here
  // process.exit(1); // Uncomment if you want to exit after logging
});

app.start({
  address: "localhost",
  port: 3000,
});
