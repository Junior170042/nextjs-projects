
import PostDetailComponent from "@/app/pages/PostDetail";
export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PostDetailComponent id={id!} />
}