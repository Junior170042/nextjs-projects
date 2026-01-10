
import * as PostService from "@/app/api/services/post.service";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../../authorize";
import { UserRole } from "@/app/types";
import { handleError } from "@/app/api/api_helpers";

export async function POST(req: NextRequest) {

    try {
        const isallowed = await requireRole(req, [UserRole.USER, UserRole.ADMIN]);
        if (isallowed.error) {
            return NextResponse.json({ success: false, error: isallowed.error }, { status: 403 });
        }
        if (!isallowed.userId || !isallowed.userRole) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }
        const { postId, userId, type } = await req.json();
        if (!postId || postId === "" || !userId || userId === "" || !type || type === "") return NextResponse.json({ success: false, error: "Post id, user id and reaction type are required!" }, { status: 400 });

        if (userId !== isallowed.userId) return NextResponse.json({ success: false, error: "Unauthorized!" }, { status: 401 });

        if (type !== "like" && type !== "dislike") return NextResponse.json({ success: false, error: "Invalid reaction type!" }, { status: 400 });

        const reaction = await PostService.addReaction({ postId, userId, type });
        return NextResponse.json({ success: true, data: reaction }, { status: 200 });
    } catch (error: unknown) {
        return handleError(error, "posts endpoint");
    }
}