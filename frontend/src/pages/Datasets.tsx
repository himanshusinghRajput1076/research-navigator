import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Plus, Database, Download, ExternalLink } from 'lucide-react';

export default function Datasets() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('Cybersecurity / IoT');
  const [sizeMb, setSizeMb] = useState('');
  const [numSamples, setNumSamples] = useState('');
  const [numFeatures, setNumFeatures] = useState('');
  const [license, setLicense] = useState('CC BY 4.0');
  const [sourceUrl, setSourceUrl] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      const res = await api.get('/datasets');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/datasets', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      setIsModalOpen(false);
      setName('');
      setDescription('');
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      name,
      domain,
      size_mb: sizeMb ? Number(sizeMb) : undefined,
      num_samples: numSamples ? Number(numSamples) : undefined,
      num_features: numFeatures ? Number(numFeatures) : undefined,
      license,
      source_url: sourceUrl,
      description,
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Dataset Name',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-white flex items-center gap-2">
            {row.name}
            {row.source_url && (
              <a href={row.source_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="text-xs text-slate-400 truncate max-w-md">{row.description}</div>
        </div>
      ),
    },
    { key: 'domain', header: 'Domain' },
    {
      key: 'metrics',
      header: 'Samples / Features',
      render: (row: any) => (
        <div className="text-xs text-slate-300">
          <span>{row.num_samples?.toLocaleString() || '-'} samples</span>
          <br />
          <span className="text-slate-500">{row.num_features || '-'} features</span>
        </div>
      ),
    },
    {
      key: 'size_mb',
      header: 'Size',
      render: (row: any) => (
        <span className="text-xs font-mono text-slate-300">
          {row.size_mb ? `${row.size_mb > 1024 ? (row.size_mb / 1024).toFixed(1) + ' GB' : row.size_mb + ' MB'}` : '-'}
        </span>
      ),
    },
    {
      key: 'license',
      header: 'License',
      render: (row: any) => (
        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">
          {row.license || 'Open Access'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Database className="h-8 w-8 text-indigo-400" />
            Benchmark Dataset Registry
          </h1>
          <p className="text-slate-400 mt-1">
            Standardized catalog of academic benchmark datasets for reproducible evaluation.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          Register Dataset
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data?.data || []} loading={isLoading} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Benchmark Dataset">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Dataset Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. N-BaIoT or CICIoT2023"
            required
          />
          <FormField
            label="Domain / Task"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Cybersecurity / Network Intrusion"
          />
          <div className="grid grid-cols-3 gap-3">
            <FormField
              label="Size (MB)"
              type="number"
              value={sizeMb}
              onChange={(e) => setSizeMb(e.target.value)}
              placeholder="5400"
            />
            <FormField
              label="Num Samples"
              type="number"
              value={numSamples}
              onChange={(e) => setNumSamples(e.target.value)}
              placeholder="7062604"
            />
            <FormField
              label="Num Features"
              type="number"
              value={numFeatures}
              onChange={(e) => setNumFeatures(e.target.value)}
              placeholder="115"
            />
          </div>
          <FormField
            label="Source URL / Download Link"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://archive.ics.uci.edu/..."
          />
          <FormField
            label="Description & Collection Protocol"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of features, attack classes, and environment setup..."
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
              {createMutation.isPending ? 'Saving...' : 'Register Dataset'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
