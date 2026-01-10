import { sql, eq, and, desc, relations, inArray } from "drizzle-orm";
import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./user";
import { db } from "../conection";

export const reactionTypeEnum = pgEnum('reaction_type', ['like', 'dislike']);

export const posts = pgTable("posts", {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    content: text("content"),
    title: text("title").notNull(),
    image: text("image").default("/postOnePlaceHolder.png"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

//Tabla comentarios
export const comments = pgTable("comments", {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    postId: uuid("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

//Tabla reacciones
export const postReactions = pgTable("post_reactions", {
    id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
    postId: uuid("post_id").references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    type: reactionTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

// 📌 Relaciones,un post tiene un autor y muchos comentarios y reacciones
export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    comments: many(comments),
    reactions: many(postReactions)
}));



// 📌 Relaciones,un comentario tiene un post y un autor
export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    author: one(users, {
        fields: [comments.userId],
        references: [users.id]
    })
}));


// 📌 Relaciones,una reacción tiene un post y un autor
export const postReactionsRelations = relations(postReactions, ({ one }) => ({
    post: one(posts, {
        fields: [postReactions.postId],
        references: [posts.id]
    }),
    user: one(users, {
        fields: [postReactions.userId],
        references: [users.id]
    })
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type PostReaction = typeof postReactions.$inferSelect;
export type NewPostReaction = typeof postReactions.$inferInsert;

// Helper interfaces for populated data
export interface PopulatedComment extends Comment {
    author: {
        id: string;
        name: string | null;
        picture: string | null;
    } | null;
}

export interface PopulatedReaction extends PostReaction {
    user: {
        id: string;
        name: string | null;
        picture: string | null;
    } | null;
}

export interface PopulatedPost extends Post {
    author: {
        id: string;
        name: string | null;
        picture: string | null;
    } | null;
    comments: PopulatedComment[];
    reactions: PopulatedReaction[];
}


export function postSchema() {
    return {
        create: async (newPost: NewPost) => {
            try {
                const [post] = await db.insert(posts).values({
                    ...newPost,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }).returning();
                return post;
            } catch (error: unknown) {
                throw error;
            }
        },

        update: async (id: string, partialPost: Partial<NewPost>) => {
            try {
                const [updated] = await db.update(posts)
                    .set({ ...partialPost, updatedAt: new Date() })
                    .where(eq(posts.id, id))
                    .returning();
                return updated;
            } catch (error: unknown) {
                throw error;
            }
        },

        remove: async (id: string) => {
            try {
                const [deleted] = await db.delete(posts).where(eq(posts.id, id)).returning();
                return deleted;
            } catch (error: unknown) {
                throw error;
            }
        },

        findById: async (id: string): Promise<PopulatedPost | null> => {
            try {
                // 1. Get Post + Author
                const postResult = await db.select({
                    post: posts,
                    author: {
                        id: users.id,
                        name: users.name,
                        picture: users.picture
                    }
                })
                    .from(posts)
                    .leftJoin(users, eq(posts.userId, users.id))
                    .where(eq(posts.id, id));

                if (postResult.length === 0) return null;

                const { post, author } = postResult[0];

                // 2. Get Comments + Authors
                const commentsResult = await db.select({
                    comment: comments,
                    author: {
                        id: users.id,
                        name: users.name,
                        picture: users.picture
                    }
                })
                    .from(comments)
                    .leftJoin(users, eq(comments.userId, users.id))
                    .where(eq(comments.postId, id))
                    .orderBy(desc(comments.createdAt));

                // 3. Get Reactions + Users
                const reactionsResult = await db.select({
                    reaction: postReactions,
                    user: {
                        id: users.id,
                        name: users.name,
                        picture: users.picture
                    }
                })
                    .from(postReactions)
                    .leftJoin(users, eq(postReactions.userId, users.id))
                    .where(eq(postReactions.postId, id));

                // Construct result
                return {
                    ...post,
                    author,
                    comments: commentsResult.map(c => ({ ...c.comment, author: c.author })),
                    reactions: reactionsResult.map(r => ({ ...r.reaction, user: r.user }))
                };

            } catch (error: unknown) {
                throw error;
            }
        },

        getAll: async (): Promise<PopulatedPost[]> => {
            try {
                // 1. Get All Posts + Authors
                const postsResult = await db.select({
                    post: posts,
                    author: {
                        id: users.id,
                        name: users.name,
                        picture: users.picture
                    }
                })
                    .from(posts)
                    .leftJoin(users, eq(posts.userId, users.id))
                    .orderBy(desc(posts.createdAt));

                if (postsResult.length === 0) return [];

                const postIds = postsResult.map(p => p.post.id);

                // 2. Get All Comments for these posts
                const commentsResult = await db.select({
                    comment: comments,
                    author: {
                        id: users.id,
                        name: users.name,
                        picture: users.picture
                    }
                })
                    .from(comments)
                    .leftJoin(users, eq(comments.userId, users.id))
                    .where(inArray(comments.postId, postIds))
                    .orderBy(desc(comments.createdAt));

                // 3. Get All Reactions for these posts
                const reactionsResult = await db.select({
                    reaction: postReactions,
                    user: {
                        id: users.id,
                        name: users.name,
                        picture: users.picture
                    }
                })
                    .from(postReactions)
                    .leftJoin(users, eq(postReactions.userId, users.id))
                    .where(inArray(postReactions.postId, postIds));


                // 4. Map everything together
                return postsResult.map(({ post, author }) => {
                    const postComments = commentsResult
                        .filter(c => c.comment.postId === post.id)
                        .map(c => ({ ...c.comment, author: c.author }));

                    const postReactionsList = reactionsResult
                        .filter(r => r.reaction.postId === post.id)
                        .map(r => ({ ...r.reaction, user: r.user }));

                    return {
                        ...post,
                        author,
                        comments: postComments,
                        reactions: postReactionsList
                    };
                });

            } catch (error: unknown) {
                throw error;
            }
        },

        // --- Comments ---
        addComment: async (newComment: NewComment) => {
            try {
                const [comment] = await db.insert(comments).values({
                    ...newComment,
                    createdAt: new Date(),
                }).returning();
                return comment;
            } catch (error: unknown) {
                throw error;
            }
        },

        getCommentsByPostId: async (postId: string) => {
            try {
                return await db.select().from(comments).where(eq(comments.postId, postId)).orderBy(desc(comments.createdAt));
            } catch (error: unknown) {
                throw error;
            }
        },

        // --- Reactions (Like/Dislike) ---
        addReaction: async (newReaction: NewPostReaction) => {
            try {
                // Check if reaction already exists
                const existingState = await db.select()
                    .from(postReactions)
                    .where(and(
                        eq(postReactions.postId, newReaction.postId),
                        eq(postReactions.userId, newReaction.userId)
                    ))
                    .limit(1);

                if (existingState.length > 0) {
                    const existing = existingState[0];
                    if (existing.type === newReaction.type) {
                        // Same reaction, remove it (toggle off)
                        const [deleted] = await db.delete(postReactions).where(eq(postReactions.id, existing.id)).returning();
                        return { ...deleted, type: "dislike" };
                    } else {
                        // Different reaction, update it
                        const [updated] = await db.update(postReactions)
                            .set({ type: newReaction.type })
                            .where(eq(postReactions.id, existing.id))
                            .returning();
                        return updated;
                    }
                }

                // New reaction
                const [reaction] = await db.insert(postReactions).values({
                    ...newReaction,
                    createdAt: new Date(),
                }).returning();
                return reaction;

            } catch (error: unknown) {
                throw error;
            }
        },

        getReactionsByPostId: async (postId: string) => {
            try {
                return await db.select().from(postReactions).where(eq(postReactions.postId, postId));
            } catch (error: unknown) {
                throw error;
            }
        }
    }
}
