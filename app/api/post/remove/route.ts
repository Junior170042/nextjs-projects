
import * as PostService from "@/app/api/services/post.service";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../../authorize";
import { UserRole } from "@/app/types";
import { handleError } from "../../api_helpers";

export async function DELETE(req: NextRequest) {
    try {
        const isallowed = await requireRole(req, [UserRole.USER, UserRole.ADMIN]);
        if (isallowed.error) {
            return NextResponse.json({ success: false, error: isallowed.error }, { status: 403 });
        }
        if (!isallowed.userId || !isallowed.userRole) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }
        const { postId, userId } = await req.json();
        if (!postId || postId === "" || !userId || userId === "") return NextResponse.json({ success: false, error: "Post id and user id are required!" }, { status: 400 });

        if (userId !== isallowed.userId) return NextResponse.json({ success: false, error: "Unauthorized!" }, { status: 401 });

        if (isallowed.userRole !== UserRole.ADMIN) {
            const currentPost = await PostService.getPostById(postId);
            if (!currentPost?.id) return NextResponse.json({ success: false, error: "Post not found!" }, { status: 404 });
            if (currentPost.userId !== userId) return NextResponse.json({ success: false, error: "Unauthorized!" }, { status: 401 });
        }
        const post = await PostService.deletePost(postId);
        if (!post?.id) return NextResponse.json({ success: false, error: "Post not found!" }, { status: 404 });

        return NextResponse.json({ success: true, data: post }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error, "posts endpoint");
    }
}