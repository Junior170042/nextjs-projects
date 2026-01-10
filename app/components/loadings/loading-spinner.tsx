"use client";
export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
    )
}