
import { PopulatedPost } from "../api/db/schema";
import { isEmail } from "./validator";

export function chartName(name: string) {
    if (isEmail(name)) {
        const nameSplit = name.split("@");
        const firstLetter = nameSplit[0].charAt(0).toUpperCase();
        return firstLetter;
    }
    const firstLetter = name.charAt(0).toUpperCase();
    return firstLetter;
}

export const isPostLikedByUser = (post: PopulatedPost, userId: string) => {
    return post.reactions?.some((reaction) => reaction.userId === userId);
}

export const getPostReactionId = (post: PopulatedPost, userId: string) => {
    return post.reactions?.find((reaction) => reaction.userId === userId)?.id;
}

export const isPostCommentedByUser = (post: PopulatedPost, userId: string) => {
    return post.comments?.some((comment) => comment.userId === userId);
}

export const isPostBelongsToUser = (post: PopulatedPost, userId: string) => {
    return (post.userId) === userId;
}