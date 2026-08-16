import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePapers, useCreatePaper } from '@/hooks/usePapers';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Plus, BookOpen, Search, UploadCloud } from 'lucide-react';

export default function Papers() {
  const navigate = useNavigate();
  const [readingStatus, setReadingStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [publicationYear, setPublicationYear] = useState(2024);
  const [venue, setVenue] = useState('');
  const [doi, setDoi] = useState('');
  const [abstract, setAbstract] = useState('');
  const [methodology, setMethodology] = useState('');
  const [arxivIds, setArxivIds] = useState('');

  const { data, isLoading } = usePapers({
    reading_status: readingStatus || undefined,
    search: searchTerm || undefined,
  });

  const createPaper = useCreatePaper();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPaper.mutateAsync({
      title,
      authors: [{ name: authorName || 'Primary Author' }],
      publication_year: Number(publicationYear),
      venue,
      doi,
      abstract,
      methodology,
      field_id: '00000000-0000-0000-0000-000000000000',
    });
    setIsModalOpen(false);
    setTitle('');
    setAuthorName('');
    setAbstract('');
  };

  const columns = [
    {
      key: 'title',
      header: 'Paper Title',
      render: (row: any) => (
        <div>
          <div className="font-semibold text-white">{row.title}</div>
          <div className="text-xs text-slate-400 truncate max-w-md">
            {Array.isArray(row.authors) ? row.authors.map((a: any) => a.name || a).join(', ') : 'Authors'}
          </div>
        </div>
      ),
    },
    {
      key: 'venue_year',
      header: 'Venue & Year',
      render: (row: any) => (
        <div className="text-xs text-slate-300">
          <span>{row.venue || 'Journal / Conference'}</span>
          <br />
          <span className="text-slate-500">{row.publication_year || row.year || '2024'}</span>
        </div>
      ),
    },
    {
      key: 'reading_status',
      header: 'Reading Status',
      render: (row: any) => <StatusBadge status={row.reading_status || row.status || 'UNREAD'} />,
    },
    {
      key: 'importance_score',
      header: 'Score',
      render: (row: any) => (
        <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
          {row.importance_score || row.importance || 5}/10
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-indigo-400" />
            Scholarly Paper Library
          </h1>
          <p className="text-slate-400 mt-1">
            Systematic academic literature library with metadata, methodology extraction, and reading workflows.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" /> Add Paper
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search papers by title, abstract, or keywords..."
            className="bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Status:</span>
          {['', 'UNREAD', 'READING', 'READ', 'ANALYZED'].map((st) => (
            <button
              key={st}
              onClick={() => setReadingStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                readingStatus === st ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {st || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          onRowClick={(row) => navigate(`/papers/${row.id}`)}
        />
      </div>

      {/* Manual Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Academic Paper">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Paper Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Attention Is All You Need"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Authors (comma separated)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Vaswani et al."
            />
            <FormField
              label="Publication Year"
              type="number"
              value={publicationYear}
              onChange={(e) => setPublicationYear(Number(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Venue (Conference / Journal)"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="NeurIPS / IEEE S&P"
            />
            <FormField
              label="DOI"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="10.1145/..."
            />
          </div>
          <FormField
            label="Abstract"
            value={abstract}
            onChange={(e) => setAbstract(e.target.value)}
            placeholder="Paste paper abstract..."
            type="textarea"
          />
          <FormField
            label="Methodology Summary"
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            placeholder="Core algorithmic architecture, baseline assumptions, dataset usage..."
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
              disabled={createPaper.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20"
            >
              {createPaper.isPending ? 'Saving...' : 'Save Paper'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
