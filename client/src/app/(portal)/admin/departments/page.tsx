'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Search, Edit3, Trash2, X, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDepartmentsPage() {
  const router = useRouter();
  const {
    currentUser,
    departments,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    isLoading
  } = useStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  // Guard against non-admin access
  useEffect(() => {
    if (currentUser && currentUser.role !== 'INSTITUTION_ADMIN') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser?.role === 'INSTITUTION_ADMIN') {
      fetchDepartments();
    }
  }, [currentUser, fetchDepartments]);

  if (currentUser?.role !== 'INSTITUTION_ADMIN') {
    return null;
  }

  const handleOpenCreate = () => {
    setEditingDept(null);
    setName('');
    setCode('');
    setDescription('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (dept: any) => {
    setEditingDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description || '');
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) {
      alert('Name and Code are required.');
      return;
    }

    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, {
          name,
          code,
          description: description || undefined
        });
      } else {
        await createDepartment({
          name,
          code,
          description: description || undefined
        });
      }
      setIsDrawerOpen(false);
    } catch (err: any) {
      alert(`Error saving department: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this department? This might unlink users assigned to it.')) {
      try {
        await deleteDepartment(id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredDepts = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 🚀 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Institutional Governance</span>
          </span>
          <h1 className="cb-page-title mt-2 font-display">Manage University Departments</h1>
          <p className="cb-page-subtitle">
            Configure the academic departments and nodes used for user categorization and opportunities.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* 🚀 Search */}
      <div className="cb-card p-4 bg-white/95 backdrop-blur-md max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search name, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cb-input pl-9"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* 🚀 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepts.length === 0 ? (
          <div className="cb-card p-12 text-center bg-white/95 backdrop-blur-md md:col-span-2 lg:col-span-3">
            <Building2 className="w-8 h-8 text-slate-350 mx-auto mb-3" />
            <h3 className="text-slate-900 font-bold text-sm">No Departments Added</h3>
            <p className="text-slate-400 text-xs mt-1">
              Add your university's departments to categorize users and research openings.
            </p>
          </div>
        ) : (
          filteredDepts.map((dept) => (
            <div key={dept.id} className="cb-card p-5 bg-white/95 backdrop-blur-md flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider">
                    {dept.code}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {(dept as any)._count?.users || 0} Members
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-primary transition-colors">
                  {dept.name}
                </h3>
                {dept.description && (
                  <p className="text-xs text-slate-500 font-semibold line-clamp-2">
                    {dept.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100/50">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  className="p-2 border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Department"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="p-2 border border-slate-200 hover:border-red-200 text-slate-650 hover:text-red-655 rounded-lg transition-colors cursor-pointer"
                  title="Delete Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🚀 Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-lg bg-white border-l border-slate-200 z-50 p-6 shadow-2xl flex flex-col overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center space-x-2.5">
                  <Building2 className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#0d3c61]">
                      {editingDept ? 'Edit Department' : 'Create Department'}
                    </h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                      Academic Intranet Node
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Computing Technologies"
                    className="cb-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                    Department Code *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="e.g. CTECH"
                    className="cb-input"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief scope, labs, research focus areas..."
                    className="w-full px-3 py-2 text-xs leading-relaxed font-sans font-semibold rounded-lg bg-white border border-slate-200 outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-655 hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingDept ? 'Update' : 'Create'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
