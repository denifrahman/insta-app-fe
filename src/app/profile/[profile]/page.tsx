'use client';
import axios from 'axios';
import Header from '@/app/components/header/Header';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface User {
    id: number;
    username: string;
    is_follow: boolean;
    avatar: string | null;
    bio: string | null;
    count_posts: number;
    count_followers: number;
    count_following: number;
}

interface Post {
    id: number;
    image_path: string | null;
    caption: string | null;
}

export default function ProfilePage() {
    const { profile } = useParams<{ profile: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const isMe = user?.username === currentUser?.username;
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/profile/${profile}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await res.json();
                setUser(data.result.user);
                setPosts(data.result.posts.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [profile]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/avatar`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (res.status === 200) {
                setUploading(false);
                setUser(res.data.result);
            }
        } catch (error) {
            console.error(error);
            setUploading(false);
            alert('Upload failed');
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading profile...</p>;
    }

    if (!user) {
        return <p className="text-center mt-10">User not found.</p>;
    }

    const handleFollowToggle = () => {
        fetch(`${baseUrl}/api/follow/${user.id}`, {
            method: user.is_follow ? 'DELETE' : 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setUser({
            ...user,
            is_follow: !user.is_follow,
            count_followers: user.is_follow
                ? (user.count_followers ?? 0) - 1
                : (user.count_followers ?? 0) + 1,
        });
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <Header page="Home" />
            <div className="flex flex-col md:flex-row items-center md:items-start md:gap-8 mb-8 mt-4">
                <div className="relative group w-28 h-28 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Image
                        src={user.avatar || '/default-avatar.png'}
                        alt="avatar"
                        fill
                        className="rounded-full object-cover border"
                    />
                    {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-full">
                            Uploading...
                        </div>
                    )}
                    {isMe && (
                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                            Change
                        </div>
                    )}
                    {isMe && (
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleAvatarChange}
                        />
                    )}

                </div>
                <div className="mt-4 md:mt-0 text-center md:text-left">
                    <h1 className="text-2xl font-semibold">{user.username}</h1>
                    <p className="text-gray-600">{user.bio}</p>
                    {!isMe && (
                        <button
                            onClick={handleFollowToggle}
                            disabled={followLoading}
                            className={`mt-2 px-4 py-1 rounded font-medium text-sm transition 
                            ${user.is_follow ? 'bg-gray-300 text-black hover:bg-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'} 
                            disabled:opacity-50`}
                        >
                            {followLoading ? 'Loading...' : user.is_follow ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                    <div className="flex gap-4 justify-center md:justify-start mt-2 text-sm">
                        <p><span className="font-semibold">{user.count_posts ?? 0}</span> posts</p>
                        <p><span className="font-semibold">{user.count_followers ?? 0}</span> followers</p>
                        <p><span className="font-semibold">{user.count_following ?? 0}</span> following</p>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {posts.length === 0 ? (
                    <p className="col-span-3 text-center text-gray-500">No posts yet.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="relative aspect-square" onClick={() => router.push(`/post/${post.id}`)}>
                            <Image
                                src={post.image_path || '/default-post-image.jpg'}
                                alt={post.caption || 'Post'}
                                fill
                                className="object-cover rounded cursor-pointer hover:opacity-80 transition"
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
