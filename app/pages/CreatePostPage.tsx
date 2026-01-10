"use client";
import { toastOptions } from '../utils/datas';
import { showToast } from 'nextjs-toast-notify';
import React, { useState } from 'react';
import { usePostContext } from '../context/postContext';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const { addPost } = usePostContext();
    const router = useRouter();
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                showToast.error('File too large (max 5MB)', toastOptions);
                return;
            }
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //validate
        if (!title || !content) {
            showToast.error('Please fill in all fields', toastOptions);
            return;
        }

        if (!isNaN(Number(title))) {
            showToast.error('Title must not be a number', toastOptions);
            return;
        }

        if (title.length < 3) {
            showToast.error('Title must be at least 3 characters long', toastOptions);
            return;
        }

        if (content.length < 20) {
            showToast.error('The content must be at least 20 characters long', toastOptions);
            return;
        }

        if (!isNaN(Number(content))) {
            showToast.error('Content must not be a number', toastOptions);
            return;
        }
        addPost({ title, content });
        router.push('/');
    };

    return <>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-500 dark:text-gray-300 text-center">Create New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:border-gray-600 dark:ring-gray-600"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Image</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-6 w-full text-center hover:bg-gray-100 transition-colors dark:border-gray-600 dark:bg-gray-800">
                                <span className="text-indigo-600 font-medium">{image ? image.name : 'Click to upload image'}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 dark:text-gray-300">Max 5MB. Support JPG, PNG.</p>
                    </div>

                    {/*Image preview*/}

                    <div className="mb-4">
                        <img src={image ? URL.createObjectURL(image) : "/postOnePlaceHolder.png"} alt="Preview" className="w-full h-[200px] object-cover rounded-lg" />
                    </div>



                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Content</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none dark:border-gray-600 dark:ring-gray-600"
                            required
                        />
                    </div>

                    <div className="flex justify-center gap-12">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all cursor-pointer"
                        >
                            Publish Post
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </>
}
