'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Clock, FileText, Check, Loader2, Link, Image, Tag as TagIcon, Mail, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useQueryClient } from '@tanstack/react-query';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const { createEvent, departments, fetchDepartments } = useStore();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    eventType: 'Lecture',
    speaker: '',
    department: '',
    date: '',
    time: '',
    venue: '',
    topic: '',
    organizerEmail: '',
    status: 'PUBLISHED',
    priority: 'MEDIUM',
    description: '',
    category: '',
    posterUrl: '',
    registrationLink: '',
    tagsString: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchDepartments().catch(() => {});
    }
  }, [isOpen, fetchDepartments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { 
      title, 
      date, 
      time, 
      venue, 
      description,
      eventType,
      speaker,
      department,
      topic,
      organizerEmail,
      status,
      priority,
      category,
      posterUrl,
      registrationLink,
      tagsString
    } = formData;

    if (!title || !date || !time || !venue || !eventType) {
      setErrorMsg('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    const tags = tagsString
      ? tagsString.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    try {
      await createEvent({
        title,
        date,
        time,
        venue,
        eventType,
        speaker: speaker || undefined,
        department: department || undefined,
        topic: topic || undefined,
        organizerEmail: organizerEmail || undefined,
        status: status as any,
        priority: priority as any,
        description: description || undefined,
        category: category || undefined,
        posterUrl: posterUrl || undefined,
        registrationLink: registrationLink || undefined,
        tags,
      });

      // Invalidate queries so the page updates live
      queryClient.invalidateQueries({ queryKey: ['events-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['events-feed'] });
      
      // Reset form and close
      setFormData({
        title: '',
        eventType: 'Lecture',
        speaker: '',
        department: '',
        date: '',
        time: '',
        venue: '',
        topic: '',
        organizerEmail: '',
        status: 'PUBLISHED',
        priority: 'MEDIUM',
        description: '',
        category: '',
        posterUrl: '',
        registrationLink: '',
        tagsString: '',
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50 text-left">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900 leading-tight">Schedule New Event</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Publish academic lectures, milestone deadlines, workshops, or symposiums</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
                <div className="p-6 space-y-6 text-left">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left Column: Core Event Information */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                        Core Details
                      </h3>

                      {/* Title */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Event Title *</label>
                        <input
                          type="text"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Guest Lecture on Quantum Computing"
                          className="cb-input"
                        />
                      </div>

                      {/* Event Type & Topic */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Event Type *</label>
                          <select
                            name="eventType"
                            required
                            value={formData.eventType}
                            onChange={handleChange}
                            className="cb-input"
                          >
                            <option value="Lecture">Lecture</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Symposium">Symposium</option>
                            <option value="Conference">Conference</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Milestone">Milestone</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">Topic</label>
                          <input
                            type="text"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="e.g. Cryptography"
                            className="cb-input"
                          />
                        </div>
                      </div>

                      {/* Speaker & Organizer Email */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>Speaker</span>
                          </label>
                          <input
                            type="text"
                            name="speaker"
                            value={formData.speaker}
                            onChange={handleChange}
                            placeholder="e.g. Dr. Jane Doe"
                            className="cb-input"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>Organizer Email</span>
                          </label>
                          <input
                            type="email"
                            name="organizerEmail"
                            value={formData.organizerEmail}
                            onChange={handleChange}
                            placeholder="e.g. contact@univ.edu"
                            className="cb-input"
                          />
                        </div>
                      </div>

                      {/* Department & Category */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Department</label>
                          {departments && departments.length > 0 ? (
                            <select
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              className="cb-input"
                            >
                              <option value="">Select Department (Optional)</option>
                              {departments.map((dept) => (
                                <option key={dept.id} value={dept.name}>
                                  {dept.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              placeholder="e.g. Computer Science"
                              className="cb-input"
                            />
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Category</label>
                          <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Guest Lectures"
                            className="cb-input"
                          />
                        </div>
                      </div>

                      {/* Status & Priority */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">Status</label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="cb-input"
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="REVIEW_REQUIRED">Needs Review</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider">Priority</label>
                          <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="cb-input"
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Date, Location, Links, Tags & Description */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                        Logistics & Resources
                      </h3>

                      {/* Date & Time Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Date *</span>
                          </label>
                          <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="cb-input"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Time *</span>
                          </label>
                          <input
                            type="text"
                            name="time"
                            required
                            value={formData.time}
                            onChange={handleChange}
                            placeholder="e.g. 10:00 AM - 12:00 PM"
                            className="cb-input"
                          />
                        </div>
                      </div>

                      {/* Venue */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Venue *</span>
                        </label>
                        <input
                          type="text"
                          name="venue"
                          required
                          value={formData.venue}
                          onChange={handleChange}
                          placeholder="e.g. Tech Park Seminar Hall 603"
                          className="cb-input"
                        />
                      </div>

                      {/* Registration Link & Poster URL */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                            <Link className="w-3 h-3 text-slate-400" />
                            <span>Reg. Link</span>
                          </label>
                          <input
                            type="url"
                            name="registrationLink"
                            value={formData.registrationLink}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="cb-input"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                            <Image className="w-3 h-3 text-slate-400" />
                            <span>Poster URL</span>
                          </label>
                          <input
                            type="url"
                            name="posterUrl"
                            value={formData.posterUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="cb-input"
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                          <TagIcon className="w-3.5 h-3.5 text-slate-400" />
                          <span>Tags (comma separated)</span>
                        </label>
                        <input
                          type="text"
                          name="tagsString"
                          value={formData.tagsString}
                          onChange={handleChange}
                          placeholder="e.g. AI, quantum, research"
                          className="cb-input"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Description</span>
                        </label>
                        <textarea
                          name="description"
                          rows={2}
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Provide additional details or agendas..."
                          className="w-full bg-white border border-slate-200 rounded-lg p-3 font-sans text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Save Row */}
                <div className="flex justify-end gap-2 p-5 border-t border-slate-100 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-wider rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/95 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Schedule Event</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
