"use client";
import Hero3DComponent from '../components/heroComponent';
import LoadingSpinner from '../components/loadings/loading-spinner';
import { showToast } from 'nextjs-toast-notify';
import { toastOptions } from '../utils/datas';
import { usePostContext } from '../context/postContext';
import PostCard from '../components/PostCard';
import { useEffect } from 'react';

export default function HomePage() {
    const { posts, isPending, error } = usePostContext();

    useEffect(() => {
        if (error) {
            showToast.error(error, toastOptions);
        }
    }, [error]);

    return <>
        <div className="relative">
            <Hero3DComponent />
            <section className="relative h-[20rem] flex items-center justify-center bg-linear-to-br from-indigo-200 to-cyan-400 overflow-hidden dark:from-indigo-900 dark:to-indigo-900">

                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r  from-indigo-600 to-indigo-600 mb-6 drop-shadow-xl dark:from-indigo-200 dark:to-indigo-200">
                        Post & share anything!
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-200">
                        A minimal, powerful platform for sharing thoughts and moments. Built with the modern stack.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto px-4 py-16">
                {posts.length > 0 ? <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Latest Posts</h2>
                </div> : !isPending && <div className="flex items-center justify-between mb-8 shadow-lg p-4">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center w-full">No posts to show by now!</h2>
                </div>}
                {isPending && posts.length === 0 ? (
                    <LoadingSpinner />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                )}
            </section>
        </div>
    </>
}
