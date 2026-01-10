"use client";
export default function Forbiden() {
    return (
        <div className="flex items-center justify-center h-screen flex-col">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Forbidden</h1>
            <p className="text-xl text-gray-600 mb-6 dark:text-gray-400">You do not have permission to access this page.</p>
            <button onClick={() => window.location.href = "/"} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all dark:bg-indigo-700 dark:hover:bg-indigo-800">Return to Home</button>
        </div>
    );
}