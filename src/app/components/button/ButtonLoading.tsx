'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ loading, children, disabled, ...props }) => {
    return (
        <button
            disabled={disabled || loading}
            className={`flex items-center justify-center rounded px-4 py-2 text-sm font-semibold text-white transition ${
                disabled || loading ? 'bg-[#abddff] cursor-not-allowed' : 'bg-[#0095f6] hover:bg-[#007cd1]'
            }`}
            {...props}
        >
            {loading && (
                <svg
                    className="mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
