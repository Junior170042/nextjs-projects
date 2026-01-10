import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./app/api/db/schema",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
