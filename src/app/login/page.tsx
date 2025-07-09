'use client';

import { useState } from 'react';
import Head from 'next/head';
import Button from '../components/button/ButtonLoading';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailFormErrors, setEmailFormErrors] = useState('');
    const [passwordFormErrors, setPasswordFormErrors] = useState('');
    const [errorCredentials, setErrorCredentials] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const router = useRouter();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmit(true);
        let hasError = false;

        if (!email) {
            setEmailFormErrors('Email is required');
            hasError = true;
        } else {
            setEmailFormErrors('');
        }

        if (!password) {
            setPasswordFormErrors('Password is required');
            hasError = true;
        } else {
            setPasswordFormErrors('');
        }

        if (!hasError) {
            fetch(baseUrl + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
                .then(async (response) => {
                    const data = await response.json();
                    if (response.ok) {
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));
                        router.push('/');
                    } else {
                        setIsSubmit(false);
                        setErrorCredentials(data.message || 'Login failed');
                        throw new Error(data.message || 'Login failed');
                    }

                })
                .catch((error) => {
                    console.error(error);
                    setIsSubmit(false);
                    setErrorCredentials(error.message);
                }).finally(() => {
                    setIsSubmit(false);
                });
        }
    };

    return (
        <>
            <Head>
                <title>Instagram • Login</title>
                <meta content="Insta-App" />
                <link rel="icon" href="/instagram.png" />
            </Head>
            <div className="flex-1 flex min-h-screen w-full items-center justify-center bg-[#fafafa] px-4">
                <div className="relative hidden max-w-[550px] overflow-hidden mx-5 lg:block">
                    <picture>
                        <img src="/instagram-login.png" alt="denifrahman" />
                    </picture>
                </div>
                <div className="flex-1 max-w-[350px] flex flex-col items-center justify-center">
                    <div className="h-auto w-[175px] py-10">
                        <picture>
                            <img src="/logo.png" alt="denifrahman" />
                        </picture>
                    </div>
                    <div className="w-full max-w-[600px] sm:max-w-[700px] lg:max-w-[500px] px-4 sm:px-10">
                        <form onSubmit={handleSubmit}>
                            <label>
                                <input
                                    className="w-full border border-stone-300 bg-[#fafafa] px-2 py-2 text-sm focus:outline-none"

                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email or username"
                                />
                            </label>
                            <p className="h-5 text-xs text-red-600">{emailFormErrors}</p>

                            <label>
                                <input
                                    className="w-full border border-stone-300 bg-[#fafafa] px-2 py-2 text-sm focus:outline-none mt-2"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
                            </label>
                            <p className="h-5 text-xs text-red-600">{passwordFormErrors}</p>
                            <Button
                                type="submit"
                                className={`flex items-center justify-center my-5 w-full rounded px-4 py-2 text-sm font-semibold text-white ${emailFormErrors === '' && passwordFormErrors === '' && email && password
                                    ? 'bg-[#0095f6] hover:bg-[#007cd1]'
                                    : 'pointer-events-none cursor-default bg-[#abddff]'
                                    }`}
                                loading={isSubmit}
                            >
                                Log In
                            </Button>
                            <p className="h-5 text-xs text-red-600">{errorCredentials}</p>
                            <div className="mb-5 flex items-center justify-center">
                                <div className="w-full border-b border-stone-300" />
                                <p className="mx-2 text-sm font-semibold text-[#6d6d6d]">OR</p>
                                <div className="w-full border-b border-stone-300" />
                            </div>
                        </form>
                    </div>

                    <div className="mt-2 flex justify-center py-5 text-sm">
                        <p>Don&apos;t have an account?</p>
                        <button
                            type="button"
                            className="ml-1 font-semibold text-[#0095f6]"
                            onClick={() => router.push('/register')}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
