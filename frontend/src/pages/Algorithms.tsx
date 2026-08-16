import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Plus, Cpu, Code2 } from 'lucide-react';

export default function Algorithms() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Classification');
  const [timeComplexity, setTimeComplexity] = useState('O(n log n)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(n)');
  const [implementationUrl, setImplementationUrl] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['algorithms'],
    queryFn: async () => {
      const res = await api.get('/algorithms');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/algorithms', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['algorithms'] });
      setIsModalOpen(false);
      setName('');
      setDescription('');
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      name,
      category,
      time_complexity: timeComplexity,
      space_complexity: spaceComplexity,
      implementation_url: implementationUrl,
      description,
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Algorithm Name',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-white">{row.name}</div>
          <div className="text-xs text-slate-400 truncate max-w-md">{row.description}</div>
        </div>
      ),
    },
    { key: 'category', header: 'Category' },
    {
      key: 'complexity',
      header: 'Computational Complexity',
      render: (row: any) => (
        <div className="text-xs font-mono text-slate-300">
          <span>Time: {row.time_complexity || '-'}</span>
          <br />
          <span className="text-slate-500">Space: {row.space_complexity || '-'}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Cpu className="h-8 w-8 text-indigo-400" />
            Algorithm Knowledge Base
          </h1>
          <p className="text-slate-400 mt-1">
            Catalog algorithms, mathematical complexity bounds, advantages, and reference implementations.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          Catalog Algorithm
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data?.data || []} loading={isLoading} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catalog New Algorithm">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Algorithm Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Transformer / Isolation Forest / Random Forest"
            required
          />
          <FormField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Anomaly Detection / Optimization / Clustering"
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Time Complexity"
              value={timeComplexity}
              onChange={(e) => setTimeComplexity(e.target.value)}
              placeholder="O(n log n)"
            />
            <FormField
              label="Space Complexity"
              value={spaceComplexity}
              onChange={(e) => setSpaceComplexity(e.target.value)}
              placeholder="O(n)"
            />
          </div>
          <FormField
            label="Implementation URL / Code Repo"
            value={implementationUrl}
            onChange={(e) => setImplementationUrl(e.target.value)}
            placeholder="https://github.com/..."
          />
          <FormField
            label="Algorithm Description & Theoretical Basis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mathematical intuition, assumptions, and key advantages..."
            type="textarea"
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
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20"
            >
              {createMutation.isPending ? 'Saving...' : 'Catalog Algorithm'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
