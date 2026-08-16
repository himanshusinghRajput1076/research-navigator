import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProblem, useUpdateProblem } from '@/hooks/useProblems';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, HelpCircle, Target, CheckCircle2, Lightbulb } from 'lucide-react';

export default function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: problem, isLoading } = useProblem(id!);
  const updateProblem = useUpdateProblem();

  if (isLoading) return <div className="text-slate-400 text-center py-16">Loading problem details...</div>;
  if (!problem) return <div className="text-slate-400 text-center py-16">Problem not found.</div>;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/problems')}
        className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Problem Bank
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <StatusBadge status={problem.status || 'DISCOVERED'} />
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                {problem.difficulty_level || 'INTERMEDIATE'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{problem.title}</h1>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Impact: <span className="text-white font-bold">{problem.impact_score || 5}/10</span></div>
            <div className="text-xs text-slate-400">Novelty: <span className="text-white font-bold">{problem.novelty_score || 5}/10</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Problem Statement</h3>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{problem.description}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Research Question</h3>
            <p className="text-sm text-indigo-300 font-medium whitespace-pre-wrap">{problem.research_question || 'No research question formalized.'}</p>
          </div>
        </div>

        {problem.why_it_matters && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Why It Matters</h3>
            <p className="text-sm text-slate-300">{problem.why_it_matters}</p>
          </div>
        )}
      </div>
    </div>
  );
}
