"use client"

import { Navbar } from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import useAxios from '@/hooks/useAxios'
import { useAuth } from '@/contexts/AuthContext';
import { Heart, MessageCircle, ChevronLeft, ChevronRight, CirclePlus, X, Image, Globe, Github, Tag, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LikeButton from '@/features/LikePost';

const Page = () => {
  const axios = useAxios();
  const [posts, setPosts] = useState<any[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    techStack: '',
    demoLink: '',
    repoLink: '',
    images: [] as File[]
  });
  console.log(user);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: files
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    // Reset form and close modal
    setFormData({
      title: '',
      description: '',
      category: '',
      techStack: '',
      demoLink: '',
      repoLink: '',
      images: []
    });
    setShowModal(false);
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
            <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-lg border border-neutral-200">
              <p className="text-neutral-600 text-lg">No posts found</p>
              <p className="text-neutral-500 mt-2">Be the first to share your project!</p>
              <button 
                onClick={() => setShowModal(true)}
                className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center mx-auto"
              >
                <CirclePlus size={18} className="mr-2" />
                Create Post
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts?.map((post: any) => {
              const currentIndex = currentImageIndex[post.id] || 0;
              const hasImages = post.images?.length > 0;
              const totalImages = post.images?.length || 0;

              return (
                <div key={post.id} className="bg-white backdrop-blur-sm rounded-xl p-6 border border-neutral-200 hover:border-emerald-200 transition-all duration-300 hover:shadow-xl shadow-emerald-100">
                  {/* Post Header with User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-sm">
                        {post.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-neutral-800">
                      <p className="text-neutral-800 font-semibold">{post.user?.name || 'Unknown User'}</p>
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
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-800 p-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() => nextImage(post.id, totalImages)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-neutral-800 p-1 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md"
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
                                  : 'bg-white/80'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-slate-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl text-emerald-700">📷</span>
                        </div>
                        <p className="text-neutral-500 text-sm">No images</p>
                      </div>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="space-y-3">
                    <h3 className="text-neutral-800 font-bold text-xl line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-neutral-600 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                        {post.category}
                      </span>
                      <span className="text-neutral-500 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tech Stack */}
                    {post.techStack?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        {post.techStack.slice(0, 3).map((tech: string, index: number) => (
                          <span
                            key={index}
                            className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {post.techStack.length > 3 && (
                          <span className="text-neutral-500 text-xs">
                            +{post.techStack.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
                      <LikeButton postId={post.id} initialLikes={post.likesCount || 0} isLiked={post.isLiked} onLikeToggle={(newLikestatus: boolean) => {
                        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isLiked: newLikestatus } : p))
                      }} />
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-emerald-600 transition-colors duration-200">
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
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-emerald-200 hover:scale-105 flex items-center justify-center"
        >
          <CirclePlus size={24} />
        </button>
      </div>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-neutral-800">Create New Project</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title Field */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 flex items-center">
                  <FileText size={16} className="mr-2 text-emerald-600" />
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your project title"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              
              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project"
                  rows={3}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              
              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Web App, Mobile App, Design"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
              
              {/* Tech Stack Field */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 flex items-center">
                  <Tag size={16} className="mr-2 text-emerald-600" />
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
              
              {/* Demo Link Field */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 flex items-center">
                  <Globe size={16} className="mr-2 text-emerald-600" />
                  Demo Link
                </label>
                <input
                  type="url"
                  name="demoLink"
                  value={formData.demoLink}
                  onChange={handleInputChange}
                  placeholder="https://your-project-demo.com"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
              
              {/* Repo Link Field */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 flex items-center">
                  <Github size={16} className="mr-2 text-emerald-600" />
                  Repository Link
                </label>
                <input
                  type="url"
                  name="repoLink"
                  value={formData.repoLink}
                  onChange={handleInputChange}
                  placeholder="https://github.com/your-username/repo"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
              
              {/* Image Upload Field */}
              <div>
                <label className="text-sm font-medium text-neutral-700 mb-1 flex items-center">
                  <Image size={16} className="mr-2 text-emerald-600" />
                  Project Images
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Image size={24} className="text-neutral-400 mb-2" />
                      <p className="text-sm text-neutral-500">Click to upload or drag and drop</p>
                      <p className="text-xs text-neutral-400">PNG, JPG, GIF (max. 5MB each)</p>
                    </div>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="hidden" 
                    />
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <p className="text-sm text-emerald-600 mt-2">{formData.images.length} file(s) selected</p>
                )}
              </div>
            </form>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;