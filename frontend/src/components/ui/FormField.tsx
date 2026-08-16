import React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
  label: string;
  error?: string;
  as?: 'input' | 'textarea' | 'select';
  options?: { label: string; value: string }[];
}

export const FormField = React.forwardRef<any, FormFieldProps>(
  ({ label, error, as = 'input', options, className, ...props }, ref) => {
    const baseClasses = "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500";
    
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label className="text-sm font-medium text-slate-300">{label}</label>
        {as === 'textarea' ? (
          <textarea ref={ref} className={cn(baseClasses, "min-h-[100px] resize-y")} {...(props as any)} />
        ) : as === 'select' ? (
          <select ref={ref} className={baseClasses} {...(props as any)}>
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input ref={ref} className={baseClasses} {...(props as any)} />
        )}
        {error && <span className="text-xs text-rose-500">{error}</span>}
      </div>
    );
  }
);
FormField.displayName = 'FormField';
