'use client';

import { useState, use, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCommentSchema } from '@/shared/shared-utils';
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  Send, 
  GraduationCap, 
  UserSquare, 
  FileText,
  Bookmark,
  Share2,
  Paperclip
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ThreadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  // Resolve params via standard React.use in Next.js 15
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const router = useRouter();
  const { threads, addComment, currentUser, fetchThreadById, deleteThread } = useStore();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const thread = threads.find((t) => t.id === id);

  useEffect(() => {
    setLoading(true);
    fetchThreadById(id)
      .catch((e) => {
        console.error('Failed to fetch thread comments:', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, fetchThreadById]);

  // Setup form validation
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: '',
      threadId: id
    }
  });

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin rounded-full block" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="cb-card p-12 text-center bg-white/90 backdrop-blur-md">
        <h4 className="text-slate-900 font-bold text-sm">Proposal Not Found</h4>
        <p className="text-slate-500 text-xs max-w-sm mx-auto mt-2">
          This thread identifier does not match any portal discussion nodes.
        </p>
        <Link 
          href="/threads"
          className="mt-5 inline-block text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 hover:border-primary/40 bg-primary/5 px-4 py-2 rounded-lg transition-all cursor-pointer active:scale-95"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  const getLocalPart = (email?: string) => email?.split('@')[0].toLowerCase() || '';

  const isAuthorOrAdmin = 
    currentUser?.id === thread.authorId || 
    (currentUser?.email && thread.author?.email && getLocalPart(currentUser.email) === getLocalPart(thread.author.email)) ||
    currentUser?.role === 'INSTITUTION_ADMIN';

  console.log('Authorization check:', {
    currentUserId: currentUser?.id,
    currentUserEmail: currentUser?.email,
    threadAuthorId: thread.authorId,
    threadAuthorEmail: thread.author?.email,
    currentUserRole: currentUser?.role,
    isAuthorOrAdmin
  });

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this research discussion thread? All comments will be permanently lost.')) {
      return;
    }
    setDeleting(true);
    try {
      await deleteThread(thread.id);
      router.push('/threads');
    } catch (e: any) {
      alert(`Error deleting thread: ${e.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleCommentSubmit = async (data: any) => {
    try {
      await addComment(thread.id, data.content);
      reset(); // Clear input
    } catch (e: any) {
      alert(`Error submitting comment: ${e.message}`);
    }
  };

  const formatDate = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRoleBadge = (role: string) => {
    return role === 'RESEARCH_SUPERVISOR' 
      ? 'bg-[#ba1a1a]/5 text-[#ba1a1a] border-[#ba1a1a]/15'
      : 'bg-[#004495]/5 text-[#004495] border-[#004495]/15';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none text-left">
      
      {/* 1. Navigation Header Row */}
      <div className="flex justify-between items-center">
        <Link 
          href="/threads" 
          className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Feed</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {isAuthorOrAdmin && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-[9px] font-bold uppercase tracking-wider bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Proposal'}
            </button>
          )}
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
            NODE ID: {thread.id}
          </span>
        </div>
      </div>

      {/* 2. Main Full Thread Article Card */}
      <motion.article 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="cb-card p-6 sm:p-8 space-y-6 bg-white/90 backdrop-blur-md"
      >
        {/* Author Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
          <div className="flex items-center space-x-3">
            <img 
              src={thread.author?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              className="w-[42px] h-[42px] rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
              alt=""
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-slate-900 leading-none">
                  {thread.author?.name}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border leading-none ${getRoleBadge(thread.author?.role || '')}`}>
                  {thread.author?.role === 'RESEARCH_SUPERVISOR' ? (
                    <>
                      <GraduationCap className="w-2.5 h-2.5 mr-0.5" />
                      Faculty
                    </>
                  ) : (
                    <>
                      <UserSquare className="w-2.5 h-2.5 mr-0.5" />
                      Scholar
                    </>
                  )}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 leading-none">
                {thread.author?.department || 'SRM Institute'}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Published {formatDate(thread.createdAt)}</span>
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4">
          <h1 className="text-sm font-bold text-slate-900 leading-snug">
            {thread.title}
          </h1>
          <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-5 rounded-2xl border border-slate-100 font-medium">
            {thread.content}
          </div>
        </div>

        {/* Dynamic File Attachment Mock */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">📎 References & Citations ({thread.tags.length > 2 ? 2 : 1})</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[10px] font-bold text-slate-700 truncate">dst-serb-proposal-draft.pdf</span>
              </div>
              <span className="text-[9px] font-bold uppercase text-slate-400 shrink-0">3.4 MB</span>
            </div>
            {thread.tags.length > 2 && (
              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <Paperclip className="w-4 h-4 text-[#775a00] shrink-0" />
                  <span className="text-[10px] font-bold text-slate-700 truncate">gpgpu-docker-cluster-ssh.sh</span>
                </div>
                <span className="text-[9px] font-bold uppercase text-slate-400 shrink-0">12 KB</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags footer section */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
          {thread.tags.map((tag) => (
            <span 
              key={tag}
              className="bg-[#004495]/2 border border-[#004495]/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </motion.article>

      {/* 3. Comments conversation tree Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0d3c61] flex items-center space-x-2 border-b border-slate-100 pb-2 font-display">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span>Discussion Thread ({thread.comments?.length || 0})</span>
        </h3>

        {/* Dynamic recursive comments map */}
        <div className="space-y-3">
          {thread.comments?.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <p className="text-xs italic text-slate-400 font-semibold">No comments shared on this thread yet. Be the first to start the conversation!</p>
            </div>
          ) : (
            thread.comments?.map((comment) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={comment.id}
                className="p-4 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl flex items-start space-x-3.5 shadow-sm"
              >
                <img 
                  src={comment.author?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                  className="w-[34px] h-[34px] rounded-full object-cover border border-slate-200 shrink-0 shadow-sm" 
                  alt=""
                />
                
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">{comment.author?.name}</span>
                      <span className={`inline-flex px-1.5 py-0.2 rounded-full text-[8px] font-bold uppercase border leading-none ${getRoleBadge(comment.author?.role || '')}`}>
                        {comment.author?.role === 'RESEARCH_SUPERVISOR' ? 'Faculty' : 'Scholar'}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-xs leading-relaxed font-sans font-medium">
                    {comment.content}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* 4. Add Comment Form card */}
        <div className="cb-card p-5 bg-white/90 backdrop-blur-md">
          <form onSubmit={handleSubmit(handleCommentSubmit)} className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <img 
                src={currentUser?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm" 
                alt=""
              />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adding response as <span className="text-primary">{currentUser?.name}</span></span>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                {...register('content')}
                placeholder="Type your comment, resource sharing request, or peer inquiry..."
                className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-xs leading-relaxed font-sans font-semibold transition-all"
              />
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-3 bottom-3.5 p-2 rounded-lg bg-primary hover:bg-primary/95 text-white active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full block" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            {errors.content && <p className="text-[10px] text-red-500 font-semibold">{errors.content.message as string}</p>}
          </form>
        </div>

      </section>
    </div>
  );
}
