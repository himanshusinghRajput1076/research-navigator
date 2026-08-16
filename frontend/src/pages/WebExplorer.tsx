import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Globe, Search, Download, Sparkles, ExternalLink, BookOpen, Filter, CheckCircle2, ArrowRight, Link as LinkIcon, RefreshCw, FileText, Check, Copy } from 'lucide-react';

interface AcademicPaper {
  title: string;
  abstract: string;
  authors: Array<{ name: string }>;
  publication_year?: number;
  venue?: string;
  doi?: string;
  arxiv_id?: string;
  url?: string;
  pdf_url?: string;
  citation_count?: number;
  source: string;
}

export default function WebExplorer() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('transformer attention IoT anomaly detection');
  const [activeQuery, setActiveQuery] = useState('transformer attention IoT anomaly detection');
  const [selectedDomain, setSelectedDomain] = useState('Computer Science');
  const [selectedSource, setSelectedSource] = useState('all');
  const [inspectUrl, setInspectUrl] = useState('');
  const [inspectedPaper, setInspectedPaper] = useState<AcademicPaper | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [ingestedMessage, setIngestedMessage] = useState<string | null>(null);
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);

  // 9 Core Research Domains from taxonomy
  const researchDomains = [
    { label: 'Computer Science & AI', query: 'deep learning transformers self-attention' },
    { label: 'Cybersecurity & Crypto', query: 'network intrusion anomaly detection zero-day' },
    { label: 'IoT & Edge Computing', query: 'resource-constrained edge IoT microcontroller' },
    { label: 'Signal Processing', query: 'wavelet spectral estimation signal decomposition' },
    { label: 'RF & Wireless', query: 'physical layer RF fingerprinting 5G MIMO' },
    { label: 'Physics & Quantum', query: 'quantum computing variational algorithms Hamiltonian' },
    { label: 'Mathematics & Optimization', query: 'convex optimization stochastic gradient non-convex' },
    { label: 'Robotics & Autonomy', query: 'reinforcement learning motion planning SLAM' },
    { label: 'Emerging Technologies', query: 'neuromorphic bio-inspired edge intelligence' },
  ];

  // Fetch real-time academic papers
  const { data: searchResponse, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['webExplorer', activeQuery, selectedSource],
    queryFn: async () => {
      const res = await api.get(
        `/academic/search?q=${encodeURIComponent(activeQuery)}&source=${selectedSource}&limit=12`
      );
      return res.data.data;
    },
    enabled: !!activeQuery,
  });

  // 1-Click Ingest mutation
  const ingestMutation = useMutation({
    mutationFn: async (paper: AcademicPaper) => {
      const res = await api.post('/academic/ingest', paper);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      queryClient.invalidateQueries({ queryKey: ['gaps'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setIngestedMessage(data.message || 'Paper successfully imported to your Research Library!');
      setTimeout(() => setIngestedMessage(null), 5000);
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveQuery(searchTerm.trim());
    }
  };

  const handleDomainSelect = (domainName: string, domainQuery: string) => {
    setSelectedDomain(domainName);
    setSearchTerm(domainQuery);
    setActiveQuery(domainQuery);
  };

  const handleInspectUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectUrl.trim()) return;
    setIsInspecting(true);
    try {
      const res = await api.post('/academic/inspect-url', { url: inspectUrl.trim() });
      setInspectedPaper(res.data.data);
    } catch (err) {
      console.error('URL inspection failed:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleCopyBibtex = (paper: AcademicPaper) => {
    const key = (paper.title || 'paper').split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + (paper.publication_year || '2024');
    const authors = Array.isArray(paper.authors) ? paper.authors.map((a) => a.name).join(' and ') : 'Authors';
    const bib = `@article{${key},\n  title = {${paper.title}},\n  author = {${authors}},\n  year = {${paper.publication_year || 2024}},\n  journal = {${paper.venue || 'Preprint'}},\n  doi = {${paper.doi || 'N/A'}}\n}`;
    navigator.clipboard.writeText(bib);
    setCopiedDoi(paper.title);
    setTimeout(() => setCopiedDoi(null), 2500);
  };

  const papers: AcademicPaper[] = searchResponse?.results || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" /> Real-Time Academic Web Discovery
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Academic Web Explorer & Ingestion Portal
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore live preprints, journal publications, and datasets across <span className="text-indigo-400 font-medium">arXiv, Crossref, OpenAlex, and Semantic Scholar</span>. Ingest papers directly into your research library with automated AI gap discovery.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 px-5 py-3.5 rounded-xl text-xs text-slate-300">
            <div>
              <span className="text-indigo-400 font-bold block text-base">250M+</span>
              <span className="text-slate-400 text-[11px]">Indexed Works</span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div>
              <span className="text-emerald-400 font-bold block text-base">Live</span>
              <span className="text-slate-400 text-[11px]">Real-Time Feeds</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scientific keywords, authors, method names, or equations..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Sources (arXiv + Crossref + OpenAlex)</option>
              <option value="arxiv">arXiv Only</option>
              <option value="crossref">Crossref / Journals Only</option>
              <option value="openalex">OpenAlex Repository</option>
            </select>

            <button
              type="submit"
              disabled={isLoading || isFetching}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/30"
            >
              {isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search Web</span>
            </button>
          </div>
        </form>

        {/* Domain Preset Tabs */}
        <div className="mt-4 flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 self-center mr-1">Taxonomy Presets:</span>
          {researchDomains.map((d) => (
            <button
              key={d.label}
              onClick={() => handleDomainSelect(d.label, d.query)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDomain === d.label
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* URL / DOI Scraper & Ingestion Tool */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-indigo-400" />
          Direct URL / DOI / arXiv Paper Inspector
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Paste any academic article link, arXiv URL (e.g. <code className="text-indigo-300">https://arxiv.org/abs/1706.03762</code>), or DOI to extract live metadata and ingest it.
        </p>

        <form onSubmit={handleInspectUrl} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inspectUrl}
            onChange={(e) => setInspectUrl(e.target.value)}
            placeholder="Paste arXiv link (e.g. https://arxiv.org/abs/2301.07094) or DOI (e.g. 10.1145/3372278.3390678)..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isInspecting || !inspectUrl.trim()}
            className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            {isInspecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
            <span>Inspect Link</span>
          </button>
        </form>

        {inspectedPaper && (
          <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-indigo-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {inspectedPaper.source}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{inspectedPaper.title}</h4>
                <p className="text-xs text-slate-400">
                  {Array.isArray(inspectedPaper.authors) ? inspectedPaper.authors.map((a) => a.name).join(', ') : 'Authors'} • {inspectedPaper.publication_year || 2024}
                </p>
              </div>

              <button
                onClick={() => ingestMutation.mutate(inspectedPaper)}
                disabled={ingestMutation.isPending}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{ingestMutation.isPending ? 'Ingesting...' : 'Import to Library + Extract Gaps'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 line-clamp-3">{inspectedPaper.abstract}</p>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {ingestedMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{ingestedMessage}</span>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Live Literature Feed ({papers.length} results)
          </h2>
          <p className="text-xs text-slate-400">
            Displaying real-time academic records for query: <span className="text-indigo-400 font-mono">"{activeQuery}"</span>
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Querying real-time global academic registries (arXiv, Crossref, OpenAlex)...</p>
        </div>
      )}

      {/* Grid of Real-Time Academic Papers */}
      {!isLoading && papers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map((paper, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-xl group"
            >
              <div className="space-y-2.5">
                {/* Meta Badges */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      {paper.source}
                    </span>
                    {paper.publication_year && (
                      <span className="text-slate-400 font-medium">{paper.publication_year}</span>
                    )}
                  </div>

                  {paper.citation_count !== undefined && (
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {paper.citation_count.toLocaleString()} citations
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {paper.title}
                </h3>

                {/* Authors & Venue */}
                <div className="text-xs text-slate-400 line-clamp-1">
                  <span className="text-slate-500">By: </span>
                  {Array.isArray(paper.authors)
                    ? paper.authors.map((a) => a.name).join(', ')
                    : 'Academic Author'}
                </div>
                {paper.venue && (
                  <div className="text-[11px] text-indigo-400/90 italic line-clamp-1">
                    {paper.venue}
                  </div>
                )}

                {/* Abstract snippet */}
                <p className="text-xs text-slate-300/90 line-clamp-3 leading-relaxed pt-1">
                  {paper.abstract || 'No abstract text available in index record.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {paper.pdf_url && (
                    <a
                      href={paper.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      title="Open PDF full-text"
                    >
                      <FileText className="w-3 h-3 text-red-400" />
                      <span>PDF</span>
                    </a>
                  )}

                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      title="View on Publisher / arXiv"
                    >
                      <ExternalLink className="w-3 h-3 text-indigo-400" />
                      <span>Link</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleCopyBibtex(paper)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    title="Copy BibTeX Citation"
                  >
                    {copiedDoi === paper.title ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDoi === paper.title ? 'Copied' : 'BibTeX'}</span>
                  </button>
                </div>

                <button
                  onClick={() => ingestMutation.mutate(paper)}
                  disabled={ingestMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Import & Extract Gaps</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && papers.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Globe className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No academic papers found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query or switching the source provider (e.g. from arXiv to Crossref/OpenAlex).
          </p>
        </div>
      )}
    </div>
  );
}
