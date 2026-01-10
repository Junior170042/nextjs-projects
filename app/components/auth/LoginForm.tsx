"use client";
import { useState, useTransition } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail } from 'lucide-react';
import { isEmail } from '../../utils/validator';
import { toastOptions } from '../../utils/datas';
import { showToast } from "nextjs-toast-notify"
import type { ApiResponse, LoginResponse } from '../../types';
import { getErrorMessage } from '../lib/utils';
export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isVerifying, setIsVerifying] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const handleRequestLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            showToast.error("An email is required", toastOptions);
            return;
        }

        if (!isEmail(email)) {
            showToast.error("Invalid email address", toastOptions);
            return;
        }

        try {
            startTransition(async () => {

                const response = await fetch("/api/auth/loginrequest", {
                    method: "POST",
                    body: JSON.stringify({ email }),
                });

                const result = await response.json() as ApiResponse<LoginResponse>;
                const isSuccess = result.success;

                if (isSuccess && result.message === 'Code sent!') {
                    setIsVerifying(true);
                    return;
                }

                if (!isSuccess && result.error === "Must verify auth code!") {
                    setError("We have already sent you a code that you did not use. Please verify your code!");
                    setIsVerifying(true);
                    return;
                }

                if (!isSuccess) {
                    setError(result.error || "Something went wrong!");
                    return;
                }
            });

        } catch (e: unknown) {
            setError(getErrorMessage(e, "requesting login"));
        }
    };

    function handleLogin() {
        setError('');
        if (!code) {
            showToast.error("A code is required", toastOptions);
            return;
        }

        if (!isEmail(email)) {
            showToast.error("Invalid email address", toastOptions);
            return;
        }

        if (code.length < 6) {
            showToast.error("Invalid code!", toastOptions);
            return;
        }

        try {
            startTransition(async () => {

                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    body: JSON.stringify({ email, code: (code).trim() }),
                });

                const result = await response.json();
                if (!result?.success && result?.error) {
                    setError(result.error);
                    return;
                }
                login(result?.data as LoginResponse);
            });

        } catch (e: unknown) {
            setError(getErrorMessage(e, "login"));
        }
    }

    return (
        <form className="space-y-6 w-full max-w-sm">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome</h2>
            <p className="text-center dark:text-gray-400 text-gray-800 mb-8">Sign with your email address</p>

            {!isVerifying && <div className="space-y-4">
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full text-gray-800 dark:text-gray-200 dark:bg-gray-900/50 border dark:border-gray-700 rounded-xl px-10 py-3  placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="Your email"

                    />
                </div>
            </div>}

            {(error && error !== "") && <div className="space-y-4">
                <p className="text-red-500 text-md text-center mb-2 p-2 shadow-lg rounded-xl dark:shadow-gray-700">{error}</p>
            </div>}

            {!isVerifying && <button
                onClick={handleRequestLogin}
                disabled={isPending}
                className="w-full main-btn transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
                {isPending ? "Waiting..." : "Sign In"}
            </button>}

            {isVerifying && <>
                <input type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full text-gray-800 dark:text-gray-200 dark:bg-gray-900/50 border dark:border-gray-700 rounded-xl px-10 py-3  placeholder-gray-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all mb-4"
                    placeholder="Verification code..."
                />
                <button
                    onClick={handleLogin}
                    disabled={isPending}
                    className="w-full main-btn transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                    {isPending ? "Waiting..." : "Verify"}
                </button>
                <p className="text-center text-gray-400 mt-2">Want another code? <span className="text-indigo-500 cursor-pointer" onClick={() => setIsVerifying(false)}>Request</span></p>
            </>

            }
        </form>
    )
}
