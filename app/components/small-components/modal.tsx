"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useModalContext } from "@/app/context/modalContext";
import { X } from "lucide-react";

export default function FullScreenModal({ children }: { children: React.ReactNode }) {
    const { isOpen, closeModal } = useModalContext();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Content */}
                    <div className="relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg sm:rounded-xl overflow-y-auto max-h-[90vh]">
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>

                        <div className="flex flex-col space-y-4">
                            {children}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}