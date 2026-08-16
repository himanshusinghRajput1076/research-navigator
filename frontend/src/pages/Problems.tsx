import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProblems, useCreateProblem } from '@/hooks/useProblems';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Plus, HelpCircle } from 'lucide-react';

export default function Problems() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [impactScore, setImpactScore] = useState(7);
  const [noveltyScore, setNoveltyScore] = useState(7);

  const { data, isLoading } = useProblems({ status: statusFilter || undefined });
  const createProblem = useCreateProblem();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProblem.mutateAsync({
      title,
      description,
      research_question: researchQuestion,
      why_it_matters: whyItMatters,
      difficulty_level: difficulty as any,
      impact_score: Number(impactScore),
      novelty_score: Number(noveltyScore),
      field_id: '00000000-0000-0000-0000-000000000000',
    });
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setResearchQuestion('');
  };

  const columns = [
    {
      key: 'title',
      header: 'Research Problem Title',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-white">{row.title}</div>
          <div className="text-xs text-slate-400 truncate max-w-md">{row.research_question || row.description}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => <StatusBadge status={row.status || 'DISCOVERED'} />,
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (row: any) => (
        <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">
          {row.difficulty_level || row.difficulty || 'INTERMEDIATE'}
        </span>
      ),
    },
    {
      key: 'scores',
      header: 'Impact / Novelty',
      render: (row: any) => (
        <div className="text-xs text-slate-300">
          <span className="text-emerald-400">Impact: {row.impact_score || row.impact || 5}/10</span>
          <br />
          <span className="text-indigo-400">Novelty: {row.novelty_score || row.novelty || 5}/10</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <HelpCircle className="h-8 w-8 text-indigo-400" />
            Problem Bank
          </h1>
          <p className="text-slate-400 mt-1">
            Systematic repository of open research questions, known limitations, and problem statements.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" /> Formulate Problem
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
        <span className="text-xs font-medium text-slate-400">Filter by Status:</span>
        <div className="flex flex-wrap gap-2">
          {['', 'DISCOVERED', 'INVESTIGATING', 'GAP_FOUND', 'VALIDATED', 'SOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {st || 'All Problems'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          onRowClick={(row) => navigate(`/problems/${row.id}`)}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Formulate Research Problem">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Problem Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Robust Intrusion Detection for Resource-Constrained IoT Nodes"
            required
          />
          <FormField
            label="Formal Research Question"
            value={researchQuestion}
            onChange={(e) => setResearchQuestion(e.target.value)}
            placeholder="Can RF physical layer signatures detect unseen zero-day attacks with <5ms latency?"
          />
          <FormField
            label="Problem Statement & Background *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the scientific bottleneck and why existing solutions fail..."
            type="textarea"
            required
          />
          <FormField
            label="Why It Matters"
            value={whyItMatters}
            onChange={(e) => setWhyItMatters(e.target.value)}
            placeholder="Real-world impact, affected domains, industrial or scientific relevance..."
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
                <option value="EXPERT">EXPERT</option>
              </select>
            </div>
            <FormField
              label="Impact Score (1-10)"
              type="number"
              value={impactScore}
              onChange={(e) => setImpactScore(Number(e.target.value))}
            />
            <FormField
              label="Novelty Score (1-10)"
              type="number"
              value={noveltyScore}
              onChange={(e) => setNoveltyScore(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProblem.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20"
            >
              {createProblem.isPending ? 'Saving...' : 'Register Problem'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
