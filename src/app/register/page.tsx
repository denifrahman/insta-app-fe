'use client';

import React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import Button from '../components/button/ButtonLoading';

const SignUp: NextPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [emailFormErrors, setEmailFormErrors] = React.useState('');
    const [passwordFormErrors, setPasswordFormErrors] = React.useState('');
    const [usernameFormErrors, setUsernameFormErrors] = React.useState('');
    const [isSubmit, setIsSubmit] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const handleSubmit = async (e: React.FormEvent) => {
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

        if (!username) {
            setUsernameFormErrors('Username is required');
            hasError = true;
        } else {
            setUsernameFormErrors('');
        }

        if (!hasError) {
            try {
                const response = await fetch(baseUrl + '/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ email, password, username }),
                });
                const data = await response.json();
                if (response.ok) {
                    router.push('/login');
                    setIsSubmit(false);
                } else {
                    hasError = true;
                    setIsSubmit(false);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                setIsSubmit(false);
            }
        }
    };

    return (
        <div>
            <Head>
                <title>Instagram • Sign up</title>
                <meta content="Insta App" />
                <link rel="icon" href="/logo.png" />
            </Head>
            <div className="flex min-h-[100vh] w-full items-center justify-center bg-[#fafafa]">
                <div>
                    <div className="flex max-w-[350px] flex-col items-center justify-center border border-stone-300 bg-white">
                        <div className="h-auto w-[175px] pt-10 pb-5">
                            <picture>
                                <img src="/logo.png" alt="denifrahman" />
                            </picture>
                        </div>
                        <div className="px-10 pb-5 text-center font-semibold text-[#8e8e8e]">
                            <p>Sign up to see photos and videos from your friends.</p>
                        </div>
                        <div className="w-full px-10">
                            <form onSubmit={handleSubmit}>
                                <label>
                                    {' '}
                                    <input
                                        className="w-full border border-stone-300 bg-[#fafafa] px-2 py-[7px] text-sm focus:outline-none"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Username"
                                    />
                                </label>
                                <p className="h-[30px] text-[10px] text-red-600">
                                    {usernameFormErrors}
                                </p>
                                <label>
                                    {' '}
                                    <input
                                        className=" w-full border border-stone-300 bg-[#fafafa] px-2 py-[7px] text-sm focus:outline-none"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email address"
                                    />
                                </label>
                                <p className="h-[20px] pb-2 text-[10px] text-red-600">
                                    {emailFormErrors}
                                </p>
                                <label>
                                    {' '}
                                    <input
                                        className="w-full border border-stone-300 bg-[#fafafa] px-2 py-[7px] text-sm focus:outline-none"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                    />
                                </label>
                                <p className="h-[20px] text-[10px] text-red-600">
                                    {passwordFormErrors}
                                </p>
                                <Button
                                    type="submit"
                                    className={`flex items-center justify-center my-5 w-full rounded px-4 py-2 text-sm font-semibold text-white ${emailFormErrors === '' && passwordFormErrors === '' && email && password
                                        ? 'bg-[#0095f6] hover:bg-[#007cd1]'
                                        : 'pointer-events-none cursor-default bg-[#abddff]'
                                        }`}
                                    loading={isSubmit}
                                >
                                    Sign Up
                                </Button>
                            </form>
                        </div>
                    </div>
                    <div className="mt-2 flex max-w-[350px] justify-center border border-stone-300 bg-white py-5 text-[14px]">
                        <p>Have an account?</p>
                        <button
                            className="ml-1 font-semibold text-[#0095f6]"
                            type="button"
                            onClick={() => router.push('/login')}
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
