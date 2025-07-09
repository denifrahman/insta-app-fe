'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
interface Post {
    id: number,
    user_id: number,
    caption: string,
    image_path: string,
    is_liked: boolean,
    created_at: string,
    likes_count: number,
    user: {
        id: number,
        name: string,
        avatar: string,
        email: string,
        username: string
    }
}

interface User {
    id: number;
    username: string;
    avatar: string;
}

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [exploreUsers, setExploreUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    const router = useRouter();

    <button onClick={() => setLiked(!liked)}>
        <Heart
            size={24}
            className={`transition-colors ${liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            fill={liked ? 'red' : 'none'}
        />
    </button>


    const handleLikeOrUnlike = (isLiked: boolean, id: number) => {
        console.log(isLiked, id);
        if (isLiked) {
            fetch(`${baseUrl}/api/unlike/${id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ post_id: id }),
            });
        } else {
            fetch(`${baseUrl}/api/likes/${id}`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ post_id: id }),
            });
        }
        setPosts(
            posts.map((post) => {
                if (post.id === id) {
                    return {
                        ...post,
                        is_liked: !isLiked,
                        likes_count: isLiked
                            ? (post.likes_count ?? 0) - 1
                            : (post.likes_count ?? 0) + 1,
                    };
                }
                return post;
            })
        );

    }
    useEffect(() => {
        // check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        const fetchData = async () => {
            try {
                const postRes = await fetch(baseUrl + '/api/posts', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const postData = await postRes.json();
                setPosts(postData.result.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto px-4 gap-4 mt-6">
            <div className="w-full max-w-lg mx-auto">
                <div className="flex-1 space-y-4">
                    {posts.length === 0 ? (
                        <p>No posts from followed users yet.</p>
                    ) : (
                        posts.map((post) => (

                            <div key={post.id} className="bg-white border rounded shadow p-4">

                                <div className="flex items-center gap-3 mb-2">
                                    <Image
                                        src={post.user.avatar || '/logo.png'}
                                        alt={post.user.username}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                        onClick={() => {
                                            router.push(`/profile/${post?.user?.username}`);
                                        }}
                                    />
                                    <p className="font-semibold">{post.user.username}</p>
                                </div>

                                <div className="relative w-full h-[400px] mb-2" >
                                    <Image
                                        src={post.image_path}
                                        alt={post.caption || 'Post image'}
                                        fill
                                        className="object-contain rounded"
                                        onClick={() => router.push(`/post/${post.id}`)}

                                    />
                                </div>

                                <div className="flex items-center gap-4 mb-2">
                                    <button onClick={() => handleLikeOrUnlike(post.is_liked, post.id)}>
                                        <Heart
                                            size={24}
                                            className={`transition-colors ${post.is_liked ? 'text-red-500' : 'text-gray-700'
                                                } hover:text-red-500`}
                                        />
                                    </button>
                                    <p className="text-sm">{post.likes_count ?? 0} likes</p>

                                    <button onClick={() => router.push(`/post/${post.id}`)}>
                                        <MessageCircle size={24} className="text-gray-600 hover:text-blue-500 transition-colors" />
                                    </button>
                                </div>
                                <p className="text-sm">{post.caption}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
