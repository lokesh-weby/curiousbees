// apps/web/src/components/shared/forms/TextInput.tsx
'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface TextInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  required?: boolean;
  placeholder?: string;
  type?: string;
  error?: FieldError;
  className?: string;
}

export function TextInput({
  label,
  name,
  register,
  required = false,
  placeholder = '',
  type = 'text',
  error,
  className,
}: TextInputProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          'w-full rounded border bg-surface-container-high p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary',
          error && 'border-destructive focus:ring-destructive'
        )}
        {...register(name, { required })}
      />
      {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
    </div>
  );
}
