"use client";
import { motion } from 'framer-motion';

export const LoadingPrincipal = () => {
    return (
        <div className="fixed inset-0 z-[9999] backdrop-blur-sm h-screen w-screen  bg-transparent">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className=" h-full grid place-items-center"
            >
                {/* Logo Container */}
                <div className="relative h-32 w-32">
                    <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.2, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <div className="absolute inset-0 flex-center">
                        <img src="postOne.png" className="w-[20rem] dark:filter dark:invert" alt="postOne" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
