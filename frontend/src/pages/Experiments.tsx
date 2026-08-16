import { useState } from 'react';
import { useExperiments, useCreateExperiment } from '@/hooks/useExperiments';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Plus, TestTube, Cpu, BarChart2 } from 'lucide-react';

export default function Experiments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [baselineMethod, setBaselineMethod] = useState('');
  const [proposedMethod, setProposedMethod] = useState('');
  const [codeRepository, setCodeRepository] = useState('');

  const { data, isLoading } = useExperiments();
  const createExperiment = useCreateExperiment();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createExperiment.mutateAsync({
      title,
      description,
      baseline_method: baselineMethod,
      proposed_method: proposedMethod,
      code_repository: codeRepository,
      experiment_status: 'DESIGNED',
    });
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setBaselineMethod('');
    setProposedMethod('');
  };

  const columns = [
    {
      key: 'title',
      header: 'Experiment Title',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-white">{row.title}</div>
          <div className="text-xs text-slate-400 truncate max-w-md">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'experiment_status',
      header: 'Status',
      render: (row: any) => <StatusBadge status={row.experiment_status || 'DESIGNED'} />,
    },
    {
      key: 'baseline_method',
      header: 'Baseline vs Proposed',
      render: (row: any) => (
        <div className="text-xs">
          <span className="text-slate-400">Baseline: {row.baseline_method || 'Standard ML'}</span>
          <br />
          <span className="text-indigo-400 font-medium">Proposed: {row.proposed_method || 'Custom Architecture'}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <TestTube className="h-8 w-8 text-indigo-400" />
            Experiment Lab & Benchmarking
          </h1>
          <p className="text-slate-400 mt-1">
            Design experiments, benchmark proposed algorithms against baseline methods, and log multi-dimensional evaluation metrics.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          Design Experiment
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data?.data || []} loading={isLoading} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Design New Research Experiment">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Experiment Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Evaluation of IoTGeM Anomaly Detection on N-BaIoT Dataset"
            required
          />
          <FormField
            label="Description & Experimental Hypothesis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="State the objective, testing parameters, and expected evaluation outcomes..."
            type="textarea"
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Baseline Method"
              value={baselineMethod}
              onChange={(e) => setBaselineMethod(e.target.value)}
              placeholder="e.g. Isolation Forest / Autoencoder"
            />
            <FormField
              label="Proposed Method"
              value={proposedMethod}
              onChange={(e) => setProposedMethod(e.target.value)}
              placeholder="e.g. Transformer-based IoTGeM Model"
            />
          </div>
          <FormField
            label="Code Repository URL"
            value={codeRepository}
            onChange={(e) => setCodeRepository(e.target.value)}
            placeholder="https://github.com/your-org/research-experiment"
          />

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
              disabled={createExperiment.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20"
            >
              {createExperiment.isPending ? 'Saving...' : 'Create Experiment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
