import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/hooks/useProjects';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, TestTube, HelpCircle } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id!);

  if (isLoading) return <div className="text-slate-400 text-center py-16">Loading project workspace...</div>;
  if (!project) return <div className="text-slate-400 text-center py-16">Project not found.</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/projects')}
        className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <StatusBadge status={project.status || 'ACTIVE'} />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">{project.title}</h1>
            <p className="text-sm text-slate-400 mt-1">{project.description}</p>
          </div>
        </div>

        {project.hypothesis && (
          <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-xl">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Guiding Project Hypothesis</h3>
            <p className="text-sm text-slate-300">{project.hypothesis}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-1">
              <BookOpen className="h-4 w-4" /> Papers
            </div>
            <div className="text-2xl font-bold text-white">{project.papers?.length || 0}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-1">
              <HelpCircle className="h-4 w-4" /> Problems
            </div>
            <div className="text-2xl font-bold text-white">{project.problems?.length || 0}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-1">
              <TestTube className="h-4 w-4" /> Experiments
            </div>
            <div className="text-2xl font-bold text-white">{project.experiments?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
