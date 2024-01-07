import "express-async-errors";
import dotenv from "dotenv";
import express, { Application } from "express";
import bodyParser from "body-parser";
import compression from "compression";
import { connection as mongooseConnection } from "mongoose";
import connectDB from "./config/mongoDB/dbConn";
import { readdirSync } from "fs";
import { join } from "path";

dotenv.config();
const app: Application = express();
const PORT: string | number = process.env.PORT || 8080;

connectDB();

console.log(process.env.NODE_ENV);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import userRoutes from "./routes/user.routes";

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);

mongooseConnection.once("open", async () => {
  console.log("Connected to MongoDB");

  // Activate cron jobs by loading and executing corresponding files
  const cronJobFiles = readdirSync(join(__dirname, "cronjobs")).filter((file) =>
    file.endsWith(".cron.ts")
  );
  cronJobFiles.forEach(async (file) => {
    try {
      const cronjobExecuteable = (
        await import(join(__dirname, "cronjobs", file))
      ).default;
      cronjobExecuteable();
    } catch (err) {
      console.log(err);
    }
  });
  console.log("Cronjobs activated");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongooseConnection.on("error", (err) => {
  console.log(err);
});
