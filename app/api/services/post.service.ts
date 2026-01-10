
import { postSchema, type NewPost } from "../db/schema/post";
import { throwError } from "../api_helpers";

export async function createPost(post: NewPost) {
    try {
        const newPost = await postSchema().create(post);
        return newPost;
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function updatePost(id: string, post: Partial<NewPost>) {
    let updatedData: Partial<NewPost> = {};
    if (post.title) updatedData.title = post.title;
    if (post.content) updatedData.content = post.content;
    try {
        const updatedPost = await postSchema().update(id, updatedData);
        return updatedPost;
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function deletePost(id: string) {
    try {
        const deletedPost = await postSchema().remove(id);
        return deletedPost;
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function getPostById(id: string) {
    try {
        const post = await postSchema().findById(id);
        return post;
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function getAllPosts() {
    try {
        const posts = await postSchema().getAll();
        return posts ?? [];
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function addReaction({ postId, userId, type }: { postId: string, userId: string, type: "like" | "dislike" }) {
    try {
        const newReaction = await postSchema().addReaction({ postId, userId, type });
        return newReaction;
    } catch (error: unknown) {
        throwError(error);
    }
}

export async function addComment({ postId, userId, content }: { postId: string, userId: string, content: string }) {
    try {
        const newComment = await postSchema().addComment({ postId, userId, content });
        return newComment;
    } catch (error: unknown) {
        throwError(error);
    }
}