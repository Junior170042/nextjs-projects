"use client";
import { useState, useTransition } from 'react';
import { Mail, Lock, User, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { validateRegister } from '../../utils/validator';
import { showToast } from 'nextjs-toast-notify';
import { toastOptions } from '../../utils/datas';
import type { LoginResponse } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const { push } = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid, errors } = validateRegister(formData.name, formData.email, formData.password, formData.confirmPassword);
        if (!isValid && (errors.name || errors.email || errors.password || errors.confirmPassword)) {
            showToast.error(errors.name! || errors.email! || errors.password! || errors.confirmPassword!, toastOptions);
            return;
        }
        startTransition(async () => {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ ...formData, authProvider: 'local' })
            });

            const result = await response.json();
            if (!result?.success && result?.error) {
                showToast.error(result.error, toastOptions);
                return;
            }

            login(result?.data as LoginResponse);
            push('/');
        })
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
            <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
            <p className="text-center text-gray-400 mb-8">Join our community today</p>

            <div className="space-y-4">
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-10 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="Full Name"
                        required
                    />
                </div>

                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-10 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="Email Address"
                        required
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                    {showPassword ? <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" onClick={() => setShowPassword(!showPassword)} /> : <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" onClick={() => setShowPassword(!showPassword)} />}
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-10 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="Password"
                        required
                    />
                </div>

                <div className="relative group">
                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                    {showPassword ? <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" onClick={() => setShowPassword(!showPassword)} /> : <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" onClick={() => setShowPassword(!showPassword)} />}
                    <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-10 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        placeholder="Confirm Password"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full main-btn transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                disabled={isPending}
            >
                {isPending ? "Waiting..." : "Sign Up"}
            </button>

            <div className="text-center text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitch}
                    className="text-purple-400 hover:text-purple-300 font-bold ml-1"
                >
                    Sign In
                </button>
            </div>
        </form>
    );
}


