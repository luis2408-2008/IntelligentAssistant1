import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../server/db";

// This will automatically run needed migrations on the database
async function main() {
  console.log("Running migrations...");
  
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

main();