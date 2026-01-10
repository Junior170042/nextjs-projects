"use client";
import { Trash2, AlertTriangle } from 'lucide-react';
import { usePostContext } from '@/app/context/postContext';
export default function AdminPage() {
    const { posts, isPending, removePost, error } = usePostContext();
    if (isPending) return (
        <div className="w-full animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full w-1/2 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full w-1/2 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full w-1/4 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full w-1/4 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full w-1/2 mb-2.5"></div>
        </div>
    );

    if (error) return <div className='flex items-center justify-center h-screen'>Error: {error}</div>;
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8 bg-red-50 p-6 rounded-2xl border border-red-100">
                <div>
                    <h1 className="text-2xl font-bold text-red-900 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" /> Admin Zone
                    </h1>
                    <p className="text-red-700">Manage content and users.</p>
                </div>
                <button
                    disabled
                    className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 transition-all cursor-not-allowed"
                >
                    CLEAR DATABASE
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">ID</th>
                            <th className="p-4 font-semibold text-gray-600">Title</th>
                            <th className="p-4 font-semibold text-gray-600">Author</th>
                            <th className="p-4 font-semibold text-gray-600">Created</th>
                            <th className="p-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    {/* even color */}
                    <tbody className="divide-y divide-gray-600 [&>tr:nth-child(even)]:bg-gray-200 [&>tr:hover]:bg-gray-300 [&>tr:hover]:cursor-pointer text-gray-600">
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td className="p-4 text-gray-500">#{post.id}</td>
                                <td className="p-4 font-medium">{post.title}</td>
                                <td className="p-4 text-gray-500">{post.author?.name}</td>
                                <td className="p-4 text-gray-400">{new Date(post.createdAt!).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <button onClick={() => removePost(post.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
