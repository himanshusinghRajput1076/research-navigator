import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Plus, Users, ExternalLink } from 'lucide-react';

export default function Researchers() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [country, setCountry] = useState('');
  const [orcidId, setOrcidId] = useState('');
  const [hIndex, setHIndex] = useState('');
  const [totalCitations, setTotalCitations] = useState('');
  const [googleScholarUrl, setGoogleScholarUrl] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['researchers'],
    queryFn: async () => {
      const res = await api.get('/researchers');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/researchers', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchers'] });
      setIsModalOpen(false);
      setName('');
      setInstitution('');
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      name,
      institution,
      country,
      orcid_id: orcidId || undefined,
      h_index: hIndex ? Number(hIndex) : undefined,
      total_citations: totalCitations ? Number(totalCitations) : undefined,
      google_scholar_url: googleScholarUrl || undefined,
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Researcher',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-white flex items-center gap-2">
            {row.name}
            {row.google_scholar_url && (
              <a href={row.google_scholar_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="text-xs text-slate-400">{row.orcid_id ? `ORCID: ${row.orcid_id}` : 'No ORCID'}</div>
        </div>
      ),
    },
    { key: 'institution', header: 'Institution' },
    { key: 'country', header: 'Country' },
    {
      key: 'metrics',
      header: 'H-Index / Citations',
      render: (row: any) => (
        <div className="text-xs text-slate-300">
          <span>H-Index: {row.h_index || '-'}</span>
          <br />
          <span className="text-slate-500">{row.total_citations?.toLocaleString() || '-'} citations</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-400" />
            Researcher Network & Community
          </h1>
          <p className="text-slate-400 mt-1">
            Map leading authors, co-authorship clusters, ORCID profiles, and citation metrics.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          Add Researcher
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <DataTable columns={columns} data={data?.data || []} loading={isLoading} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Researcher Profile">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Jane Doe"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Stanford University"
            />
            <FormField
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
            />
          </div>
          <FormField
            label="ORCID iD"
            value={orcidId}
            onChange={(e) => setOrcidId(e.target.value)}
            placeholder="0000-0002-1825-0097"
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="H-Index"
              type="number"
              value={hIndex}
              onChange={(e) => setHIndex(e.target.value)}
              placeholder="28"
            />
            <FormField
              label="Total Citations"
              type="number"
              value={totalCitations}
              onChange={(e) => setTotalCitations(e.target.value)}
              placeholder="4500"
            />
          </div>
          <FormField
            label="Google Scholar URL"
            value={googleScholarUrl}
            onChange={(e) => setGoogleScholarUrl(e.target.value)}
            placeholder="https://scholar.google.com/citations?user=..."
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
              {createMutation.isPending ? 'Saving...' : 'Register Researcher'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
