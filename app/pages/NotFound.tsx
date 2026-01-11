"use client";
import { useRouter } from "next/router";
export default function NotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex-col-center w-full">
            <img src="postOne.png" alt="postOne" className="w-32 h-32 filter drop-shadow-lg rounded-full invert-[100%]" />
            <p className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">
                The page you are looking for does not exist.
            </p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 mt-2 cursor-pointer"
                onClick={() => router.push('/')}
            >
                Go Home
            </button>
        </div>
    );
}