
import * as PostService from "@/app/api/services/post.service";
import { NextResponse } from "next/server";
import { handleError } from "../../api_helpers";
export async function GET() {
    try {
        const posts = await PostService.getAllPosts();
        return NextResponse.json({ success: true, data: posts });
    } catch (error) {
        return handleError(error, "posts endpoint");
    }
}