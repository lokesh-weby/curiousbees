// apps/web/src/components/shared/forms/FormWrapper.tsx
'use client';

import React from 'react';
import { useForm, FormProvider, SubmitHandler, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

/**
 * Generic form wrapper that sets up react-hook-form with a Zod schema.
 * Usage example:
 * const schema = z.object({ name: z.string().min(1) });
 * <FormWrapper schema={schema} onSubmit={data => console.log(data)}>
 *   {({ register, formState }) => (
 *     <>
 *       <input {...register('name')} />
 *       <button type="submit">Submit</button>
 *     </>
 *   )}
 * </FormWrapper>
 */
interface FormWrapperProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: SubmitHandler<T>;
  /** Render function receiving form helpers */
  children: (props: {
    register: UseFormReturn<T>['register'];
    formState: UseFormReturn<T>['formState'];
    setValue: UseFormReturn<T>['setValue'];
    watch: UseFormReturn<T>['watch'];
  }) => React.ReactNode;
  className?: string;
}

export function FormWrapper<T extends Record<string, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
    mode: 'onTouched',
  });

  const { handleSubmit, register, formState, setValue, watch } = methods;

  return (
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit as any)} noValidate>
        {children({ register, formState, setValue, watch })}
      </form>
    </FormProvider>
  );
}
