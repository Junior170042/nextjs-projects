import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Heart, MessageCircle, Pencil, Send, Trash, User, X } from 'lucide-react';
import { getPostReactionId, isPostBelongsToUser, isPostCommentedByUser, isPostLikedByUser } from '../utils/helpers';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../context/AuthContext';
import { usePostContext } from '../context/postContext';
import { showToast } from 'nextjs-toast-notify';
import { toastOptions } from '../utils/datas';
import { useCallback, useState } from 'react';
import { PopulatedPost } from '../api/db/schema';
import Image from 'next/image';
import Link from 'next/link';
interface PostCardProps {
    post: PopulatedPost;
}

export default function PostCard({ post }: PostCardProps) {
    const { user } = useAuth();
    const { addReaction, addComment, updatePost, removePost } = usePostContext();

    const [currentComment, setCurrentComment] = useState('');
    const [isShowComment, setIsShowComment] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [removeMode, setRemoveMode] = useState(false);
    const [currentPostId, setCurrentPostId] = useState<string | null>(null);
    const [currentPost, setCurrentPost] = useState<PopulatedPost | null>(null);

    const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentComment(e.target.value);
    }, []);

    const showEditMode = useCallback(() => {
        setEditMode(true);
    }, []);

    const handlePostEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.name === "title") {
            setCurrentPost(prev => ({ ...prev!, title: e.target.value }))
        } else if (e.target.name === "content") {
            setCurrentPost(prev => ({ ...prev!, content: e.target.value }))
        }
    }, []);

    const hideEditMode = useCallback(() => {
        setEditMode(false);
    }, []);

    const handleAddComment = (postId: string) => {
        if (!currentComment.trim() || !user || !postId || currentComment === "") return;
        const comment = {
            postId: postId,
            userId: user?.id ?? "",
            content: currentComment
        }
        addComment(comment)
        setCurrentComment('');
    };

    const handleRemovePost = useCallback(() => {
        if (!currentPostId) return;
        removePost(currentPostId)
        setRemoveMode(false);
    }, [currentPostId]);

    const handleUpdatePost = useCallback(() => {
        if (!currentPost || !user) return;
        updatePost({
            postId: currentPost.id,
            userId: user.id,
            updatedPost: currentPost
        })
        setEditMode(false);
    }, [currentPost]);

    const showComment = useCallback(() => {
        setIsShowComment(true);
    }, []);

    const hideComment = useCallback(() => {
        setIsShowComment(false);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative"
        >
            <Card className="w-full cursor-pointer relative shadow-lg">
                <CardHeader className="flex justify-between py-4 border-b border-default-400">
                    <div className="flex">
                        <User
                            name={post.author?.name!} />
                        <p >{post.author?.name}</p>
                    </div>

                    { /* TODO: pop over with edit and delete options */}
                    {isPostBelongsToUser(post, user?.id ?? "") && <div className="flex space-x-4 p-2 shadow-sm rounded-md shadow-default-400 px-2 justify-between items-center">
                        <Pencil className="text-default-400 cursor-pointer w-4 h-4" onClick={() => { setCurrentPost(post); showEditMode() }} />
                        <Trash className="text-default-400 cursor-pointer w-4 h-4"
                            onClick={() => { setCurrentPostId(post.id); setRemoveMode(true) }}
                        />
                    </div>}
                </CardHeader>
                <CardContent className="px-3 py-0 text-sm text-muted-foreground">
                    <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
                        {post.title}
                    </h3>
                    <p className="mb-4 text-muted-foreground line-clamp-3">
                        {post.content}
                    </p>

                    <div className="w-full h-48 mb-4 overflow-hidden rounded-xl">
                        <Image
                            alt={post.title}
                            className="w-full h-full object-cover"
                            src={post.image ?? "/postOnePlaceHolder.png"}
                            width={500}
                            height={300}
                        />
                    </div>

                </CardContent>
                <CardFooter className="gap-3 relative">
                    <div className="flex gap-1 items-center">
                        <button
                            className={`cursor-pointer ${isPostLikedByUser(post, user?.id ?? "") ? ' text-danger' : 'text-default-400'}`}
                            onClick={async (e) => {
                                e.stopPropagation()
                                addReaction({
                                    postId: post.id,
                                    userId: user?.id ?? "",
                                    type: isPostLikedByUser(post, user?.id ?? "") ? "dislike" : "like",
                                    id: isPostLikedByUser(post, user?.id ?? "") ? getPostReactionId(post, user?.id ?? "") : ""
                                })
                            }}
                        >
                            <Heart size={20} fill={isPostLikedByUser(post, user?.id ?? "") ? '#3e4af3ff' : 'none'} stroke={isPostLikedByUser(post, user?.id ?? "") ? '#3e4af3ff' : 'currentColor'} />
                        </button>
                        <span className="font-semibold text-default-400 text-small">{post.reactions?.length}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <button className={`cursor-pointer ${isPostCommentedByUser(post, user?.id ?? "") ? ' text-blue-500' : 'text-default-400'}`} onClick={(e) => e.stopPropagation()}>
                            <MessageCircle size={20} onClick={showComment} />
                        </button>
                        <span className="font-semibold text-default-400 text-small">{post.comments?.length}</span>

                    </div>
                    <Link
                        href={`/post/${post.id}`}
                        className="absolute top-0 right-0 bg-transparent border-none mr-4"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </CardFooter>
                <AnimatePresence>
                    {isShowComment && <motion.div
                        initial={{ opacity: 0, y: 20, x: 20, height: "0%" }}
                        animate={{ opacity: 1, y: 0, x: 0, height: "65%" }}
                        transition={{ duration: 0.3 }}
                        exit={{ opacity: 0, y: 20, x: 20, height: "0%", transition: { duration: 0.5 } }}

                        className="absolute bottom-0 right-0 w-full rounded-l-md rounded-r-md z-50 bg-gray-300 flex">
                        <div className="w-full overflow-y-auto">
                            {post.comments?.length > 0 ? post.comments.map((comment) => (
                                <div key={comment.id} className="text-default-400  text-sm  pl-2 mt-2  w-[95%] max-h-[25%] border-b border-gray-400 ">
                                    <p className="font-bold text-xs dark:text-gray-800">{comment.author?.id === user?.id ? "You" : (comment.author?.name)?.split(" ")[0]} {new Date(comment.createdAt!).toLocaleDateString()} </p>
                                    <p className="line-clamp-2 -mt-[1px] dark:text-gray-800">{comment.content}</p>
                                </div>
                            )) : <p className="p-2 text-center text-default-400 w-full dark:text-gray-800">No comments yet</p>}
                        </div>
                        <div className="flex w-full absolute bottom-0">
                            <input
                                type="text" value={currentComment}
                                placeholder="Add a comment..."
                                onChange={handleCommentChange}
                                className="w-full h-full text-default-400 p-4 bg-gray-200 rounded-lg placeholder:text-gray-500 dark:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <Send size={30} onClick={() => handleAddComment(post.id)} className="cursor-pointer text-gray-400 absolute right-2 bottom-2" />

                        </div>
                        <X size={25} onClick={hideComment} className="cursor-pointer text-gray-500 absolute top-2  right-2" />
                    </motion.div>}
                </AnimatePresence>
            </Card>

            <AnimatePresence>
                {editMode && <motion.div
                    initial={{ opacity: 0, y: 20, x: 20, width: "0%" }}
                    animate={{ opacity: 1, y: 0, x: 0, width: "100%" }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, y: 20, x: 20, width: "0%", transition: { duration: 0.3 } }}
                    className="absolute bottom-0 left-0 w-full rounded-l-md rounded-r-md z-50 h-full"

                >
                    <div className="flex flex-col gap-2 w-full p-2 h-full bg-gray-300 rounded-lg">
                        <label htmlFor="title" className='text-default-400 dark:text-gray-800'>Title</label>
                        <input
                            type="text" value={currentPost?.title ?? ""}
                            placeholder="Add a comment..."
                            name="title"
                            id="title"
                            onChange={handlePostEditChange}
                            className="p-3 text-default-400 p-4 bg-gray-200 rounded-md placeholder:text-gray-500 dark:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border-1 border-gray-500" />
                        <label htmlFor="content" className='text-default-400 dark:text-gray-800'>Content</label>
                        <textarea
                            value={currentPost?.content as string}
                            placeholder="Add a comment..."
                            name="content"
                            id="content"
                            onChange={handlePostEditChange}
                            className=" text-default-400 p-4 bg-gray-200 rounded-md placeholder:text-gray-500 dark:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 h-50 border-1 border-gray-500"
                        />
                        <div className="flex gap-12 mt-4 justify-center">
                            <button
                                onClick={handleUpdatePost}
                                className="text-gray-200 px-4 py-2 bg-blue-500 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                Save changes
                            </button>
                            <button
                                onClick={hideEditMode}
                                className="text-gray-200 px-4 py-2 bg-gray-400 rounded-md placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>}

                {removeMode && <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="absolute px-4 bottom-0 left-0 w-full rounded-l-md rounded-r-md z-50 flex h-full z-50 grid place-items-center backdrop-blur-xs dark:backdrop-blur-md"
                >
                    <Card className="w-full h-[40%] bg-muted text-muted-foreground shadow-lg">
                        <CardHeader>
                            <h2 className="text-center font-bold w-full text-foreground">Remove Post</h2>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center">Are you sure you want to remove this post?</p>
                        </CardContent>
                        <CardFooter className="flex gap-2 justify-center">
                            <Button
                                onClick={handleRemovePost}
                                variant="destructive"
                                size="sm"
                            >Remove</Button>
                            <Button
                                onClick={() => setRemoveMode(false)}
                                variant="outline"
                                size="sm"
                            >Cancel</Button>
                        </CardFooter>
                    </Card>
                </motion.div>}
            </AnimatePresence>
        </motion.div>
    )
}
