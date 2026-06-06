import { z } from 'zod';

// Constant list of SRM Institute Departments
export const SRM_DEPARTMENTS = [
  'Computing Technologies (CSE / IT / Swe)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Biotechnology & Bioengineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Physics & Nanotechnology',
  'Chemistry & Materials Science',
  'Mathematics & Actuarial Science',
  'School of Management (SOM)',
  'Health Sciences & Research'
] as const;

// Helper to validate SRMIST emails
export const isSrmEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith('@srmist.edu.in');
};

// Zod Schemas shared between backend and frontend

// 1. Thread Creation Schema
export const CreateThreadSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .refine((val) => val.trim().length > 0, 'Title cannot be blank'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .refine((val) => val.trim().length > 0, 'Content cannot be blank'),
  tags: z
    .array(z.string().min(1, 'Tag must not be empty'))
    .min(1, 'Please add at least one tag')
    .max(5, 'You can add up to 5 tags only')
});

// 2. Comment Creation Schema
export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(2, 'Comment must be at least 2 characters')
    .max(500, 'Comment cannot exceed 500 characters')
    .refine((val) => val.trim().length > 0, 'Comment cannot be empty'),
  threadId: z.string().cuid('Invalid thread identifier')
});

// 3. Faculty Opportunity Creation Schema
export const CreateOpportunitySchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string()
    .min(15, 'Description must be at least 15 characters'),
  department: z.string().refine((val) => {
    return SRM_DEPARTMENTS.includes(val as any);
  }, 'Please select a valid department'),
  researchDomain: z
    .string()
    .min(3, 'Research domain/topic must be at least 3 characters')
    .max(50, 'Research domain cannot exceed 50 characters')
});

// 4. User Profile Update Schema
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .optional(),
  role: z.enum(['RESEARCH_SUPERVISOR', 'RESEARCH_SCHOLAR', 'INSTITUTION_ADMIN'], {
    errorMap: () => ({ message: 'Invalid role selection' })
  }).optional(),
  department: z.string().optional(),
  departmentId: z.string().optional(),
  bio: z
    .string()
    .max(250, 'Bio cannot exceed 250 characters')
    .optional(),
  interests: z
    .array(z.string().min(1, 'Interest name must be valid'))
    .max(8, 'You can select up to 8 interests')
    .optional()
});
