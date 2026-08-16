import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    solved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    validated: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    reading: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    exploring: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    testing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    running: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    abandoned: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    potential: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    identified: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    planned: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    unread: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const defaultColor = 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize",
      statusColors[status] || defaultColor,
      className
    )}>
      {status}
    </span>
  );
}
