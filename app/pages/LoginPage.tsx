"use client";
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden dark:bg-gray-900 ">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br dark:from-indigo-900/40 dark:via-gray-900 dark:to-purple-900/40" />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] dark:bg-indigo-600/30 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] dark:bg-purple-600/30 rounded-full blur-[128px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 border border-orange-300 dark:border-blue-900 dark:from-purple-500 dark:to-indigo-600 rounded-3xl pb-4">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className=" flex-center"
                >
                    <img src="postOne.png" alt="postOne" className="w-32 h-32 filter drop-shadow-lg rounded-full dark:invert-[100%]" />
                </motion.div>

                {/* Form Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl dark:bg-gray-800">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="login"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <LoginForm />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
