import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePaper, useUpdatePaper } from '@/hooks/usePapers';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, BookOpen, ExternalLink, Sparkles, FileText, CheckCircle2, Bookmark, Star } from 'lucide-react';
import api from '@/services/api';

export default function PaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: paper, isLoading } = usePaper(id!);
  const updatePaper = useUpdatePaper();

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'limitations' | 'notes'>('overview');

  const handleStatusChange = (status: string) => {
    updatePaper.mutate({ id: id!, data: { reading_status: status as any } });
  };

  const handleAiExplain = async () => {
    if (!paper) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/explain-paper', {
        title: paper.title,
        abstract: paper.abstract,
        methodology: paper.methodology,
      });
      setAiAnalysis(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-slate-400 text-center py-16">Loading paper details...</div>;
  }

  if (!paper) {
    return <div className="text-slate-400 text-center py-16">Paper not found.</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/papers')}
        className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Paper Library
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <StatusBadge status={paper.reading_status || 'UNREAD'} />
              {paper.publication_year && (
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  {paper.publication_year}
                </span>
              )}
              {paper.venue && (
                <span className="text-xs text-slate-400 font-medium">
                  {paper.venue}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {paper.title}
            </h1>

            <div className="text-sm text-slate-400">
              <span className="text-slate-500">Authors: </span>
              {Array.isArray(paper.authors)
                ? paper.authors.map((a: any) => a.name || a).join(', ')
                : 'Unknown authors'}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-2">
              {paper.doi && <div><span className="text-slate-500">DOI:</span> {paper.doi}</div>}
              {paper.arxiv_id && <div><span className="text-slate-500">arXiv:</span> {paper.arxiv_id}</div>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Reading Status</label>
              <select
                value={paper.reading_status || 'UNREAD'}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="UNREAD">UNREAD</option>
                <option value="READING">READING</option>
                <option value="READ">READ</option>
                <option value="ANALYZED">ANALYZED</option>
                <option value="REPRODUCED">REPRODUCED</option>
                <option value="CRITIQUED">CRITIQUED</option>
              </select>
            </div>

            <button
              onClick={handleAiExplain}
              disabled={aiLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-sm font-medium transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              {aiLoading ? 'Analyzing...' : 'AI Paper Analysis'}
            </button>
          </div>
        </div>

        {/* AI Insight Box */}
        {aiAnalysis && (
          <div className="mt-6 bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                <Sparkles className="h-4 w-4" />
                AI Research Synthesis
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                {aiAnalysis.classification}
              </span>
            </div>
            <p className="text-sm text-slate-300">{aiAnalysis.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div>
                <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Key Contributions</h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {aiAnalysis.keyContributions?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Identified Limitations</h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {aiAnalysis.limitations?.map((l: string, i: number) => <li key={i}>{l}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mt-8 gap-6 text-sm font-medium">
          {(['overview', 'methodology', 'limitations', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize transition-colors ${
                activeTab === tab
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 text-sm text-slate-300 leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Abstract</h3>
                <p className="whitespace-pre-wrap">{paper.abstract || 'No abstract recorded.'}</p>
              </div>
            </div>
          )}

          {activeTab === 'methodology' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Methodological Architecture</h3>
                <p className="whitespace-pre-wrap">{paper.methodology || 'No methodology notes recorded for this paper.'}</p>
              </div>
            </div>
          )}

          {activeTab === 'limitations' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Acknowledged Limitations & Future Work</h3>
                <p className="whitespace-pre-wrap">{paper.limitations || 'No explicit limitations logged yet.'}</p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Personal Research Notes</h3>
                <p className="whitespace-pre-wrap">{paper.personal_notes || 'No personal notes logged yet.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
