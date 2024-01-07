import cron from "node-cron";
import { checkAndNotifyLowStock } from "../services/stock.service";

export default function () {
  // Schedule a cron job to run hourly
  cron.schedule("0 * * * *", () => {
    checkAndNotifyLowStock();

    process.stdout.on("data", (data) => {
      console.log(`Cron job 1 output: ${data}`);
    });

    process.stderr.on("data", (data) => {
      console.error(`Cron job 1 error: ${data}`);
    });

    process.on("error", (err) => {
      console.error(`Cron job 1 process error: ${err.stack}`);
    });

    process.on("exit", (code) => {
      console.log(`Cron job 1 process exited with code ${code}`);
    });
  });
}
