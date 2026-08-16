import { useState } from 'react';
import { useGaps, useCreateGap } from '@/hooks/useGaps';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Plus, Target, Sparkles, AlertCircle } from 'lucide-react';

export default function Gaps() {
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [gapStatement, setGapStatement] = useState('');
  const [evidence, setEvidence] = useState('');
  const [whatNotTested, setWhatNotTested] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(7);
  const [noveltyEstimate, setNoveltyEstimate] = useState(8);
  const [impactEstimate, setImpactEstimate] = useState(8);

  const { data, isLoading } = useGaps({ gap_status: statusFilter || undefined });
  const createGap = useCreateGap();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createGap.mutateAsync({
      title,
      gap_statement: gapStatement,
      evidence,
      what_not_tested: whatNotTested,
      confidence_score: Number(confidenceScore),
      novelty_estimate: Number(noveltyEstimate),
      impact_estimate: Number(impactEstimate),
      field_id: '00000000-0000-0000-0000-000000000000', // fallback or selected field
    });
    setIsModalOpen(false);
    setTitle('');
    setGapStatement('');
    setEvidence('');
  };

  const columns = [
    {
      key: 'title',
      header: 'Research Gap Title',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-white">{row.title}</div>
          <div className="text-xs text-slate-400 truncate max-w-md">{row.gap_statement}</div>
        </div>
      ),
    },
    {
      key: 'gap_status',
      header: 'Status',
      render: (row: any) => <StatusBadge status={row.gap_status || 'POTENTIAL'} />,
    },
    {
      key: 'confidence_score',
      header: 'Confidence',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-700 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(row.confidence_score || 5) * 10}%` }}></div>
          </div>
          <span className="text-xs text-slate-300">{row.confidence_score || 5}/10</span>
        </div>
      ),
    },
    {
      key: 'novelty_estimate',
      header: 'Novelty / Impact',
      render: (row: any) => (
        <div className="text-xs text-slate-300">
          <span className="text-indigo-400">N: {row.novelty_estimate || 5}</span> | <span className="text-amber-400">I: {row.impact_estimate || 5}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Target className="h-8 w-8 text-indigo-400" />
            Research Gap Engine
          </h1>
          <p className="text-slate-400 mt-1">
            Systematic identification of unresolved research questions and untried scientific methodologies.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          Formulate Research Gap
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
        <span className="text-sm font-medium text-slate-300">Filter by Verification Status:</span>
        <div className="flex flex-wrap gap-2">
          {['', 'POTENTIAL', 'NEEDS_VERIFICATION', 'STRONGLY_SUPPORTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {st || 'All Gaps'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data?.data || []} loading={isLoading} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Formulate New Research Gap">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Gap Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Cross-dataset generalization under concept drift in IoT anomaly detection"
            required
          />
          <FormField
            label="Formal Gap Statement *"
            value={gapStatement}
            onChange={(e) => setGapStatement(e.target.value)}
            placeholder="Specify what has not been tested or remains unsolved in published literature..."
            type="textarea"
            required
          />
          <FormField
            label="Supporting Literature Evidence"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Citations, known baseline bottlenecks, conflicting empirical results..."
            type="textarea"
          />
          <FormField
            label="What Has NOT Been Tested"
            value={whatNotTested}
            onChange={(e) => setWhatNotTested(e.target.value)}
            placeholder="e.g. Temporal RF behavioral dynamics on battery-powered edge devices..."
          />

          <div className="grid grid-cols-3 gap-3">
            <FormField
              label="Confidence (1-10)"
              type="number"
              value={confidenceScore}
              onChange={(e) => setConfidenceScore(Number(e.target.value))}
            />
            <FormField
              label="Novelty (1-10)"
              type="number"
              value={noveltyEstimate}
              onChange={(e) => setNoveltyEstimate(Number(e.target.value))}
            />
            <FormField
              label="Impact (1-10)"
              type="number"
              value={impactEstimate}
              onChange={(e) => setImpactEstimate(Number(e.target.value))}
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
              disabled={createGap.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20"
            >
              {createGap.isPending ? 'Saving...' : 'Register Gap'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
