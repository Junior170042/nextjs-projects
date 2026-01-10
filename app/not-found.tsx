
"use client";
export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen flex-col">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Not Found</h1>
            <p className="text-xl text-gray-600 mb-6 dark:text-gray-400">The page you are looking for does not exist.</p>
            <button onClick={() => window.location.href = "/"} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all dark:bg-indigo-700 dark:hover:bg-indigo-800">Return to Home</button>
        </div>
    );
}