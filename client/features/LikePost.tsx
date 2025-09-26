"use client"

import { Heart } from 'lucide-react'
import useAxios from "@/hooks/useAxios"
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface LikeButtonProps {
    postId: string
    initialLikes: number
    isLiked: boolean
    onLikeToggle?: (newLikestatus: boolean) => void
}

const LikeButton = ({ postId, initialLikes, isLiked: initialLiked, onLikeToggle }: LikeButtonProps) => {
    const [isLiked, setIsLiked] = useState(initialLiked)
    const [likesCount, setLikesCount] = useState(initialLikes)
    const axios = useAxios()
    const { user } = useAuth()

    const handleLike = async () => {
        if (!user) return

        try {
            const newLikestatus = !isLiked
            setIsLiked(newLikestatus)
            setLikesCount(prev => newLikestatus ? prev + 1 : prev - 1)

            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/posts/${postId}/like`, {
                like: newLikestatus,
                // withCredentials: true
            })

            if (onLikeToggle) {
                onLikeToggle(newLikestatus)
            }
        } catch (error) {
            console.log("Error updating likes:", error)
            setIsLiked(!isLiked)
            setLikesCount(prev => !isLiked ? prev + 1 : prev - 1)
        }
    }
    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors duration-200 ${isLiked ? 'text-emerald-600' : 'text-neutral-600 hover:text-emerald-600'
                }`}
            aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
        >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{likesCount}</span>
        </button>
    )
}

export default LikeButton