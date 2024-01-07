import { connect, ConnectOptions } from "mongoose";

async function connectDB() {
  try {
    const connectOptions: ConnectOptions = {
      dbName: "E-Commerce",
    };
    await connect(process.env.DATABASE_URI!, connectOptions);
  } catch (err: any) {
    console.error("Error connecting to the database:", err.message);
  }
}

export default connectDB;
