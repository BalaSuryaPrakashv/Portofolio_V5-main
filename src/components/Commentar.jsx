import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin, CheckCircle2, Trash2, ShieldAlert, ChevronDown, MessageCircle } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';

// 🔐 Change this to your secret password
const ADMIN_PASSWORD = 'Surya@2005';

// Password Modal Component
const PasswordModal = memo(({ onConfirm, onCancel, label = 'Delete' }) => {
    const [input, setInput] = useState('');
    const [shake, setShake] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleConfirm = useCallback(() => {
        if (input === ADMIN_PASSWORD) {
            onConfirm();
        } else {
            setShake(true);
            setInput('');
            setTimeout(() => setShake(false), 500);
        }
    }, [input, onConfirm]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') onCancel();
    }, [handleConfirm, onCancel]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-80 shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-full">
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm">Admin Authentication</h3>
                        <p className="text-gray-400 text-xs">Enter password to {label.toLowerCase()} all comments</p>
                    </div>
                </div>
                <input
                    ref={inputRef}
                    type="password"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter admin password"
                    className={`w-full p-3 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all ${
                        shake ? 'border-red-500 animate-shake' : 'border-white/10 focus:border-red-500/50'
                    }`}
                />
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/30 transition-all font-medium"
                    >
                        {label}
                    </button>
                </div>
            </div>
        </div>
    );
});

const Comment = memo(({ comment, formatDate, isPinned = false }) => (
    <div
        className={`px-4 pt-4 pb-2 rounded-xl border transition-all hover:shadow-lg hover:-translate-y-0.5 relative ${
            isPinned
                ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 hover:bg-gradient-to-r hover:from-indigo-500/15 hover:to-purple-500/15'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Pin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Pinned Comment</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            {comment.profile_image ? (
                <img
                    src={comment.profile_image}
                    alt={`${comment.user_name}'s profile`}
                    className={`w-10 h-10 rounded-full object-cover border-2 flex-shrink-0 ${
                        isPinned ? 'border-indigo-500/50' : 'border-indigo-500/30'
                    }`}
                    loading="lazy"
                />
            ) : (
                <div className={`p-2 rounded-full text-indigo-400 transition-colors ${
                    isPinned ? 'bg-indigo-500/30' : 'bg-indigo-500/20'
                }`}>
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-medium truncate ${isPinned ? 'text-indigo-200' : 'text-white'}`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB. Please choose a smaller image.');
                if (e.target) e.target.value = '';
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                if (e.target) e.target.value = '';
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    maxLength={15}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    Message <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    maxLength={200}
                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white">
                    Profile Photo <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-dashed border-indigo-500/50 hover:border-indigo-500 group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-2">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [commentsOpen, setCommentsOpen] = useState(false);

    useEffect(() => {
        AOS.init({ once: false, duration: 1000 });
    }, []);

    // ✅ Extracted fetchComments so it can be reused anywhere
    const fetchComments = useCallback(async () => {
        const { data, error } = await supabase
            .from('portfolio_comments')
            .select('*')
            .eq('is_pinned', false)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching comments:', error);
            return;
        }
        setComments(data || []);
    }, []);

    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', true)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching pinned comment:', error);
                    return;
                }
                if (data) setPinnedComment(data);
            } catch (error) {
                console.error('Error fetching pinned comment:', error);
            }
        };
        fetchPinnedComment();
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchComments();

        // Realtime subscription
        const subscription = supabase
            .channel('portfolio_comments')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'portfolio_comments', filter: 'is_pinned=eq.false' },
                () => { fetchComments(); }
            )
            .subscribe();

        return () => { subscription.unsubscribe(); };
    }, [fetchComments]);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('profile-images').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('profile-images').getPublicUrl(filePath);
        return data.publicUrl;
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        const tempId = `temp-${Date.now()}`;
        try {
            const profileImageUrl = await uploadImage(imageFile);

            const newEntry = {
                id: tempId,
                content: newComment,
                user_name: userName,
                profile_image: profileImageUrl || (imageFile ? URL.createObjectURL(imageFile) : null),
                is_pinned: false,
                created_at: new Date().toISOString(),
            };

            setComments(prev => [newEntry, ...prev]);

            const { data, error } = await supabase
                .from('portfolio_comments')
                .insert([{
                    content: newComment,
                    user_name: userName,
                    profile_image: profileImageUrl,
                    is_pinned: false,
                    created_at: newEntry.created_at,
                }])
                .select()
                .single();

            if (error) {
                setComments(prev => prev.filter(c => c.id !== tempId));
                throw error;
            }

            setComments(prev => prev.map(c => c.id === tempId ? { ...c, id: data.id } : c));
            setSuccessMessage(true);
            setTimeout(() => setSuccessMessage(false), 3000);

        } catch (error) {
            setComments(prev => prev.filter(c => c.id !== tempId));
            setError('Failed to post comment. Please try again.');
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    // ✅ FIXED: Now re-fetches from Supabase after delete to confirm it actually worked
    const handleClearAllConfirm = useCallback(async () => {
        setShowClearModal(false);

        const snapshot = [...comments];
        setComments([]); // Optimistically clear UI

        try {
            const { error } = await supabase
                .from('portfolio_comments')
                .delete()
                .eq('is_pinned', false);

            if (error) throw error;

            // ✅ Re-fetch from DB to confirm deletion persisted
            await fetchComments();

            // Cleanup storage images
            const imageUrls = snapshot
                .filter(c => c.profile_image)
                .map(c => {
                    try {
                        const url = new URL(c.profile_image);
                        const match = url.pathname.match(/profile-images\/(.+)$/);
                        return match ? `profile-images/${match[1]}` : null;
                    } catch { return null; }
                })
                .filter(Boolean);

            if (imageUrls.length > 0) {
                await supabase.storage.from('profile-images').remove(imageUrls);
            }

        } catch (err) {
            console.error('Clear all failed:', err);
            // ✅ Restore snapshot if delete failed
            setComments(snapshot);
            setError('Failed to clear comments. Please check your Supabase RLS DELETE policy.');
        }
    }, [comments, fetchComments]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    }, []);

    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">

            {showClearModal && (
                <PasswordModal
                    onConfirm={handleClearAllConfirm}
                    onCancel={() => setShowClearModal(false)}
                    label="Clear All"
                />
            )}

            <div className="p-6 space-y-6">

                {successMessage && (
                    <div className="flex items-center gap-2 p-4 text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">Comment posted successfully! 🎉</p>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Comment Form */}
                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
                </div>

                {/* ── Collapsible Comments Toggle Bar ── */}
                <button
                    onClick={() => setCommentsOpen(prev => !prev)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 group"
                >
                    <div className="flex items-center gap-2 text-gray-300 group-hover:text-indigo-300 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {totalComments} {totalComments === 1 ? 'Comment' : 'Comments'}
                        </span>
                        {totalComments > 0 && !commentsOpen && (
                            <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-400 rounded-full">
                                Click to view
                            </span>
                        )}
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-all duration-300 ${
                            commentsOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                </button>

                {/* ── Collapsible Comments Panel ── */}
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        commentsOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="space-y-3 pt-1">
                        {/* Clear All button inside expanded panel */}
                        {totalComments > 0 && (
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowClearModal(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Clear All
                                </button>
                            </div>
                        )}

                        <div className="space-y-4 h-[328px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
                            {pinnedComment && (
                                <Comment comment={pinnedComment} formatDate={formatDate} isPinned={true} />
                            )}
                            {comments.length === 0 && !pinnedComment ? (
                                <div className="text-center py-8">
                                    <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
                                    <p className="text-gray-400">No comments yet. Start the conversation!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <Comment
                                        key={comment.id}
                                        comment={comment}
                                        formatDate={formatDate}
                                        isPinned={false}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.5); border-radius: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.7); }
                .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                .animate-shake { animation: shake 0.4s ease-in-out; }
                @keyframes shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }
            `}</style>
        </div>
    );
};

export default Komentar;
