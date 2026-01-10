
"use client";
import React, { useEffect } from "react";
import type { NewPostReaction, NewComment, Comment, NewPost, PopulatedPost, PopulatedComment, PostReaction, PopulatedReaction } from "@/app/api/db/schema/index";
import type { ApiResponse } from "../types/index";
import { useAuth } from "./AuthContext";
import { getErrorMessage } from "../components/lib/utils";
import { useFetchWithAuth } from "../hooks/fetchWithAuth";

//postContext.tsx
type PostContextType = {
    posts: PopulatedPost[];
    isPending: boolean;
    error: string | null;
    addPost: (post: Omit<NewPost, "userId">) => void;
    removePost: (postId: string) => void;
    updatePost: ({ postId, userId, updatedPost }: { postId: string, userId: string, updatedPost: Partial<NewPost> }) => void;
    addComment: (comment: NewComment) => void;
    addReaction: (reaction: NewPostReaction) => void;
    getPostById: (postId: string) => PopulatedPost | null;
};

const PostContext = React.createContext<PostContextType | null>(null);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
    const [posts, setPosts] = React.useState<PopulatedPost[]>([]);
    const [isPending, startTransition] = React.useTransition();
    const { isRefreshing, user } = useAuth();
    const fetchWithAuth = useFetchWithAuth();
    const [error, setError] = React.useState<string | null>(null);

    if (isRefreshing) return null;

    function addPost(post: Omit<NewPost, "userId">) {
        startTransition(async () => {
            const response = await fetchWithAuth('/post/newPost', {
                method: 'POST',
                body: JSON.stringify({ ...post, userId: user?.id }),
            });

            const result = await response.json() as ApiResponse<PopulatedPost>;
            if (!result.success || result.error) {
                setError(result.error || "Error al agregar el post");
                return
            }
            setPosts((prev) => [...prev, result.data!].sort((a, b) => b?.createdAt?.getTime()! - a?.createdAt?.getTime()!));
        })
    }

    function removePost(postId: string) {
        const currentPost = getPostById(postId);
        if (!currentPost) return;
        setPosts((prev) => prev.filter((post) => post.id !== postId));
        startTransition(async () => {
            const response = await fetchWithAuth("/post/remove", {
                method: 'DELETE',
                body: JSON.stringify({ postId, userId: user?.id }),
            });

            const result = await response.json() as ApiResponse<PopulatedPost>;
            if (!result.success || result.error) {
                setPosts((prev) => [...prev, currentPost]);
                setError(result.error || "Error al eliminar el post");
            }
        })
    }

    function getPostById(postId: string) {
        try {
            return posts.find((post) => post.id === postId) || null;
        } catch (error: unknown) {
            setError(getErrorMessage(error, "getting post!"));
            return null;
        }
    }

    function updatePost({ postId, userId, updatedPost }: { postId: string, userId: string, updatedPost: Partial<NewPost> }) {
        const currentPost = getPostById(postId);
        if (!currentPost) return;
        const { title, content } = updatedPost;
        if (!title || !content || title.trim() === "" || content.trim() === "") return;
        setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, title: title, content: content } : post));

        startTransition(async () => {
            const response = await fetchWithAuth("/post/update", {
                method: 'PUT',
                body: JSON.stringify({ postId, userId, ...updatedPost }),
            });

            const result = await response.json() as ApiResponse<PopulatedPost>;

            if (!result.success || result.error) {
                setError(result.error || "Error al actualizar el post");
                //undoing the update
                setPosts((prev) => prev.map((post) => post.id === postId ? { ...post, title: currentPost.title, content: currentPost.content } : post));
            }
        })

    }

    function addComment(comment: NewComment) {
        const currentPost = getPostById(comment.postId);
        if (!currentPost) return;
        const temporerId = crypto.randomUUID();
        const populatedComment: PopulatedComment = {
            ...comment,
            id: temporerId,
            createdAt: new Date(),
            author: { id: user?.id!, name: user?.name!, picture: user?.picture! }
        }
        setPosts((prev) => prev.map((post) => post.id === comment.postId ? { ...post, comments: [...post.comments, populatedComment] } : post));
        startTransition(async () => {
            const response = await fetchWithAuth('/post/comment', {
                method: 'POST',
                body: JSON.stringify(comment),
            });

            const result = await response.json() as ApiResponse<Comment>;
            if (!result.success || result.error) {
                setError(result.error || "Error al agregar el comentario");
                return;
            }
            const populatedComment: PopulatedComment = {
                ...result.data!,
                author: { id: user?.id!, name: user?.name!, picture: user?.picture! }
            }

            setPosts((prev) => prev.map((post) => post.id === result.data?.postId ? { ...post, comments: post.comments.filter((comment) => comment.id !== temporerId) } : post));

            setPosts((prev) => prev.map((post) => post.id === result.data?.postId ? { ...post, comments: [...post.comments, populatedComment] } : post));
        })
    }

    function addReaction(reaction: NewPostReaction) {

        if (reaction.type === "dislike" && !reaction.id) {
            setError("Reaction id is not found!");
            return;
        }

        const temporerId = crypto.randomUUID();

        let populatedReaction: PopulatedReaction = {
            ...reaction,
            id: temporerId,
            createdAt: new Date(),
            user: { id: user?.id!, name: user?.name!, picture: user?.picture! }
        }

        if (reaction.type === "dislike") {
            setPosts((prev) => prev.map((post) => post.id === reaction.postId ? { ...post, reactions: post.reactions.filter((reaction) => reaction.id !== reaction.id) } : post));
        } else {
            setPosts((prev) => prev.map((post) => post.id === reaction.postId ? { ...post, reactions: [...post.reactions, populatedReaction] } : post));
        }

        startTransition(async () => {
            const response = await fetchWithAuth('/post/reaction', {
                method: 'POST',
                body: JSON.stringify(reaction),
            });

            const result = await response.json() as ApiResponse<PostReaction>;
            if (!result.success || result.error) {
                setError(result.error || "Error al agregar la reacción");
                return;
            }

            if (result?.data?.type !== "dislike") {
                populatedReaction = {
                    ...result.data!,
                    user: { id: user?.id!, name: user?.name!, picture: user?.picture! }
                }

                //removing temporer reaction
                setPosts((prev) => prev.map((post) => post.id === reaction.postId ? { ...post, reactions: post.reactions.filter((reaction) => reaction.id !== temporerId) } : post));
                //adding new reaction
                setPosts((prev) => prev.map((post) => (post.id === result.data?.postId) && populatedReaction ? { ...post, reactions: [...post?.reactions!, populatedReaction] } : post));
                return;
            }

            setPosts((prev) => prev.map((post) => post.id === result.data?.postId ? { ...post, reactions: post.reactions.filter((reaction) => reaction.id !== result.data?.id) } : post));
        })
    }

    useEffect(() => {
        startTransition(async () => {
            const response = await fetch('/api/post/allposts');
            const result = await response.json() as ApiResponse<PopulatedPost[]>;
            if (!result.success) {
                setPosts([]);
                return;
            }
            setPosts(result.data ?? []);
        })
    }, []);

    return (
        <PostContext.Provider value={{ posts, isPending, addPost, removePost, error, updatePost, addComment, addReaction, getPostById }}>
            {children}
        </PostContext.Provider>
    );
}

export const usePostContext = () => {
    const context = React.useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext must be used within a PostProvider');
    }
    return context;
}
