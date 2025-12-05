import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth, apiFetch} from '../auth/AuthContext';
import Input from "../components/ui/Input.tsx";
import Button from "../components/ui/Button.tsx";
import {EmptyNavigationBar} from "../components/AllPages/EmptyNavigationBar.tsx";
import {SocialMediasFooter} from "../components/AllPages/SocialMediasFooter.tsx";

export default function AuthPage() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'register') {
                await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({email, name, password})
                });
            }
            const res = await apiFetch<{ access_token: string; user: { id: number; email: string; name: string } }>(
                '/auth/login',
                {method: 'POST', body: JSON.stringify({email, password})}
            );

            login(res.access_token, res.user);
            navigate('/folders');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            <EmptyNavigationBar/>
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 px-4">
                <div className="max-w-md w-full">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {mode === 'login' ? 'Welcome back' : 'Create account'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {mode === 'login'
                                    ? 'Sign in to your account to continue'
                                    : 'Get started with your new account'}
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <Input
                                id="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="AngelicaMyWaifu@gmail.com"
                                required
                            />

                            {mode === 'register' && (
                                <Input
                                    id="name"
                                    label="Full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    placeholder="Roland"
                                    required
                                />
                            )}

                            <Input
                                id="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="••••••••"
                                required
                            />

                            {error && (
                                <div
                                    className="flex items-center gap-2 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <Button type="submit" variant="primary" isLoading={loading} className="w-full">
                                {mode === 'login' ? 'Sign in' : 'Create account'}
                            </Button>
                        </form>

                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">
                                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                            </span>
                            {' '}
                            <button
                                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline focus:outline-none transition"
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            >
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <SocialMediasFooter/>
        </div>
    );
}