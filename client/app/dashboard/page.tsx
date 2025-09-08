"use client"

import { Navbar } from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const axios = useAxios();
  const [posts, setPosts] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
  }

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/posts/`, {
      withCredentials: true
    }).then((res) => {
      setPosts(res.data.data.posts);
      // Initialize image indexes for each post
      const indexes: { [key: string]: number } = {};
      res.data.data.posts.forEach((post: any) => {
        indexes[post.id] = 0;
      });
      setCurrentImageIndex(indexes);
    }).catch((err) => console.log(err.response?.data.message));
  }, []);

  useEffect(() => {
    axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/posts/`, {}, {
      withCredentials: true
    }).then((res) => console.log(res.data)).catch((err) => console.log(err.response?.data.message));
  }, []);

  const nextImage = (postId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: (prev[postId] + 1) % totalImages
    }));
  };

  const prevImage = (postId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: (prev[postId] - 1 + totalImages) % totalImages
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-emerald-50 to-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Dashboard</h1>
          <p className="text-emerald-600 text-lg">Discover amazing projects and share your creations</p>
        </div>

        {posts?.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-emerald-600 text-lg">No posts found</p>
              <p className="text-slate-400 mt-2">Be the first to share your project!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post: any) => {
              const currentIndex = currentImageIndex[post.id] || 0;
              const hasImages = post.images?.length > 0;
              const totalImages = post.images?.length || 0;

              return (
                <div key={post.id} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
                  {/* Post Header with User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {post.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-neutral-800">
                      <p className="text-neutral-800 font-semibold">{post.user?.name || 'Unknown User'}</p>
                      {/* <p className="text-emerald-600 text-sm">@{post.user?.username || 'user'}</p> */}
                    </div>
                  </div>

                  {/* Image Carousel */}
                  {hasImages ? (
                    <div className="relative mb-4 rounded-lg overflow-hidden group">
                      <img
                        src={post.images[currentIndex]}
                        alt={post.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Navigation Arrows */}
                      {totalImages > 1 && (
                        <>
                          <button
                            onClick={() => prevImage(post.id, totalImages)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => nextImage(post.id, totalImages)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}

                      {/* Image Indicator Dots */}
                      {totalImages > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {post.images.map((_: any, index: number) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                  ? 'bg-emerald-500'
                                  : 'bg-white/50'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-600/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">📷</span>
                        </div>
                        <p className="text-neutral-800 text-sm">No images</p>
                      </div>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="space-y-3">
                    <h3 className="text-neutral-800 font-bold text-xl line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-neutral-800 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="bg-purple-600/20 text-neutral-800 px-3 py-1 rounded-full text-sm">
                        {post.category}
                      </span>
                      <span className="text-neutral-800 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tech Stack */}
                    {post.techStack?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        {post.techStack.slice(0, 3).map((tech: string, index: number) => (
                          <span
                            key={index}
                            className="bg-neutral-700/50 text-neutral-800 px-2 py-1 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {post.techStack.length > 3 && (
                          <span className="text-neutral-800 text-xs">
                            +{post.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4 border-t border-neutral-700/50">
                      <button className="flex items-center gap-2 text-neutral-800 hover:text-red-400 transition-colors duration-200">
                        <Heart size={20} />
                        <span>{post.likesCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-neutral-800 hover:text-blue-400 transition-colors duration-200">
                        <MessageCircle size={20} />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <footer className='sticky bottom-0 w-full h-16 bg-neutral-400 text-neutral-800'>
        hello
      </footer>
    </div>
  );
}

export default Page;