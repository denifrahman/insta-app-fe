'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/app/components/header/Header';
import { Heart, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Comment {
    id: number;
    user: { username: string; avatar: string | null };
    body: string;
}

interface PostDetail {
    id: number;
    is_liked: boolean;
    image_path: string | null;
    caption: string | null;
    likes_count: number;
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
    const { id } = useParams<{ id: string }>();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const [post, setPost] = useState<PostDetail | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [postingComment, setPostingComment] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/posts/${id}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await res.json();
                setPost(data.result.post);

                const resComment = await fetch(`${baseUrl}/api/comments/${id}`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const comments = await resComment.json();
                setComments(comments.result.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handlePostComment = async () => {
        if (!commentInput.trim()) return;
        setPostingComment(true);
        try {
            const res = await fetch(`${baseUrl}/api/comments`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ post_id: id, body: commentInput }),
            });
            const data = await res.json();
            setComments([{
                body: commentInput,
                id: data.result.data[0].id,
                user: {
                    username: data.result.data[0].user.username,
                    avatar: data.result.data[0].user.avatar
                }
            }, ...comments]);
            setCommentInput('');
        } catch (error) {
            console.error(error);
        } finally {
            setPostingComment(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading post...</p>;
    }

    if (!post) {
        return <p className="text-center mt-10">Post not found.</p>;
    }

    const handleLikeOrUnlike = (isLiked: boolean) => {
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
        setPost({
            ...post,
            is_liked: !isLiked,
            likes_count: isLiked
                ? (post.likes_count ?? 0) - 1
                : (post.likes_count ?? 0) + 1,
        });
    }

    return (
        <div className="h-screen overflow-y-scroll bg-[#fafafa] text-[#262626] dark:bg-[#131313] dark:text-[#f1f5f9] dark:[color-scheme:dark]">
            <Header page="Home" />
            <div className="w-full max-w-lg mx-auto max-w-md mx-auto px-4 py-6">
                <div className="relative w-full aspect-square rounded overflow-hidden mb-4">
                    <Image
                        src={post.image_path || '/default-post-image.jpg'}
                        alt={post.caption || 'Post image'}
                        fill
                        className="object-contain rounded"
                    />
                </div>

                <div className="py-4 mb-4">
                    <p className="font-semibold">{post.caption}</p>
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => handleLikeOrUnlike(post.is_liked)}>
                            <Heart
                                size={24}
                                className={`transition-colors ${post.is_liked ? 'text-red-500' : 'text-gray-700'} hover:text-red-500`}
                            />
                        </button>
                        <p className="text-sm">{post.likes_count ?? 0} likes</p>

                        <button onClick={() => console.log('Open comments')}>
                            <MessageCircle size={24} className="text-gray-600 hover:text-blue-500 transition-colors" />
                        </button>
                    </div>
                </div>


                <div className="mb-4 pd-2">
                    <h3 className="font-semibold mb-2">Comments</h3>
                    {comments.length === 0 ? (
                        <p className="text-sm text-gray-500">No comments yet.</p>
                    ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex items-start gap-2">
                                    <div className="w-8 h-8 relative flex-shrink-0">
                                        <Image
                                            src={comment.user?.avatar || '/logo.png'}
                                            alt='avatar'
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-semibold mr-1">{comment.user?.username}</span>
                                            {comment.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
                        disabled={postingComment}
                    />
                    <button
                        onClick={handlePostComment}
                        disabled={postingComment || !commentInput.trim()}
                        className="text-blue-500 font-semibold text-sm disabled:opacity-50"
                    >
                        {postingComment ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
}
