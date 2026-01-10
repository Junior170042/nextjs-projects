import { sql, relations } from "drizzle-orm";
import { pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { ilike, eq } from "drizzle-orm";
import { db } from "../conection";
import { posts, comments, postReactions } from "./post";
import { throwError } from "../../api_helpers";

export const users = pgTable("users", {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(), // PK interno
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    authProvider: varchar("auth_provider", { length: 20 }).notNull(),
    name: varchar("name", { length: 255 }),
    picture: text("picture"),
    refreshToken: text("refresh_token").default(""),
    userRole: varchar("user_role", { length: 20 }).default("user"),
    verificationToken: text("verification_token").default(""),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
    postReactions: many(postReactions)
}));

export type NewUser = typeof users.$inferInsert;

export function userSchema() {

    return {
        create: async (newUser: NewUser) => {
            try {
                const [user] = await db.insert(users).values({
                    ...newUser,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }).returning();

                return user;
            } catch (error: unknown) {
                throw error;
            }
        },

        removeVerificationToken: async (email: string) => {
            try {
                await db.update(users).set({ verificationToken: "" }).where(eq(users.email, email));
            } catch (error: unknown) {
                throw error;
            }
        },

        verifyUser: async (email: string) => {
            try {
                const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
                if (!user) return null;
                return user;
            } catch (error) {
                throwError(error);
            }
        },

        setNewUser: async (email: string, verificationToken: string) => {
            const name = email.split("@")[0];
            try {
                await db.insert(users).values({
                    email,
                    verificationToken,
                    authProvider: "email",
                    name,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            } catch (error: unknown) {
                throwError(error);
            }
        },

        findByEmail: async (email: string) => {
            try {
                const [user] = await db.select().from(users).where(ilike(users.email, email)).limit(1);
                return user;
            } catch (error: unknown) {
                throwError(error);
            }
        },

        findById: async (id: string) => {
            try {
                const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
                return user;
            } catch (error: unknown) {
                throw error;
            }
        },

        addRefreshToken: async (userId: string, refreshToken: string) => {
            try {
                await db.update(users).set({ refreshToken }).where(eq(users.id, userId));
            } catch (error: unknown) {
                throw error;
            }
        },

        removeRefreshToken: async (userId: string) => {
            try {
                await db.update(users).set({ refreshToken: "" }).where(eq(users.id, userId));
            } catch (error: unknown) {
                throw error;
            }
        },

        setVerificationToken: async (email: string, verificationToken: string) => {
            try {
                await db.update(users).set({ verificationToken }).where(eq(users.email, email));
            } catch (error: unknown) {
                throw error;
            }
        },

    }
}