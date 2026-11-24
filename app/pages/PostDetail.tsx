"use client";
import { usePostContext } from "../context/postContext";
import { PopulatedComment } from "../api/db/schema";
import Image from "next/image";
import { normalizeImageSrc } from "../components/lib/utils";

export default function PostDetailComponent({ id }: { id: string }) {
    const { getPostById } = usePostContext();

    const post = getPostById(id!);
    if (!post) {
        return (
            <div className="min-h-screen flex-col-center w-full">
                <Image src="/postOne.png" alt="postOne" className="w-32 h-32 filter drop-shadow-lg rounded-full invert-100" width={128} height={128} />
                <p className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">
                    Post not found.
                </p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <Image
                    src={normalizeImageSrc(post?.image)}
                    alt={post?.title ?? "Post Image"}
                    className="w-full h-100 object-cover"
                />
                <div className="p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{post?.title}</h1>
                    <div className="flex items-center gap-2 mb-8 text-gray-500 text-sm">
                        <span className="font-medium text-gray-900">{post?.author?.name}</span>
                        <span>•</span>
                        {post?.createdAt && <span>{new Date(post?.createdAt).toLocaleDateString()}</span>}
                    </div>
                    <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap mb-12">{post?.content}</p>
                </div>
            </div>

            {/* Comments */}
            <div className="mt-12 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">Comments</h3>
                <div className="space-y-6">
                    {post?.comments?.length > 0 && post?.comments?.map((comment: PopulatedComment) => (
                        <div key={comment.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-900">{comment.author?.name}</span>
                                <span className="text-xs text-gray-400">{new Date(comment?.createdAt ?? "").toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                    {post?.comments?.length === 0 && (
                        <div className="text-center text-gray-400 italic">No comments yet.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
