
import * as PostService from "@/app/api/services/post.service";
import { handleError } from "@/app/api/api_helpers";
import { UserRole } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "../../authorize";
export async function POST(req: NextRequest) {

    try {
        const validateRole = await requireRole(req, [UserRole.USER, UserRole.ADMIN]);
        if (validateRole.error) {
            return NextResponse.json({ success: false, error: validateRole.error }, { status: 403 });
        }

        if (!validateRole.userId || !validateRole.userRole) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { title, content, } = body;
        if (!title || !content) {
            return NextResponse.json({ success: false, error: "Missing required fields!" });
        }
        const post = await PostService.createPost({ title, content, userId: validateRole.userId });
        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        return handleError(error, "newPost endpoint");
    }
}