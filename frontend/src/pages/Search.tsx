import { useState } from 'react';
import { Search as SearchIcon, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return null;
      const { data } = await api.get(`/search?q=${encodeURIComponent(searchTerm)}`);
      return data.data.results;
    },
    enabled: !!searchTerm
  });

  const { data: academicResults, isLoading: isAcademicLoading } = useQuery({
    queryKey: ['academic-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return null;
      const { data } = await api.get(`/academic/search?q=${encodeURIComponent(searchTerm)}`);
      return data.data.results;
    },
    enabled: !!searchTerm
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  const tabs = ['All', 'Papers', 'Problems', 'Gaps', 'Academic Results'];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white text-center">Global Search</h1>
      
      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across all entities..." 
          className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl pl-14 pr-6 py-4 text-lg text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-lg"
          autoFocus
        />
      </form>
      
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        {tabs.map(t => (
          <label key={t} className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input 
              type="radio" 
              name="searchTab"
              checked={activeTab === t} 
              onChange={() => setActiveTab(t)}
              className="rounded-full bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500" 
            />
            {t}
          </label>
        ))}
      </div>
      
      <div className="pt-8">
        {!searchTerm && (
          <div className="text-center text-slate-500">
            Enter a query to see results
          </div>
        )}
        
        {(isSearchLoading || isAcademicLoading) && (
          <div className="text-center text-slate-400">Loading results...</div>
        )}

        {searchTerm && !isSearchLoading && !isAcademicLoading && (
          <div className="space-y-8">
            {/* Papers */}
            {(activeTab === 'All' || activeTab === 'Papers') && searchResults?.papers && searchResults.papers.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Local Papers</h3>
                <div className="space-y-4">
                  {searchResults.papers.map((p: any) => (
                    <div key={p.id} className="border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-lg font-medium text-indigo-400">{p.title}</h4>
                      {p.abstract && <p className="text-slate-300 text-sm mt-1 line-clamp-2">{p.abstract}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problems */}
            {(activeTab === 'All' || activeTab === 'Problems') && searchResults?.problems && searchResults.problems.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Problems</h3>
                <div className="space-y-4">
                  {searchResults.problems.map((p: any) => (
                    <div key={p.id} className="border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-lg font-medium text-orange-400">{p.title}</h4>
                      {p.description && <p className="text-slate-300 text-sm mt-1 line-clamp-2">{p.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gaps */}
            {(activeTab === 'All' || activeTab === 'Gaps') && searchResults?.gaps && searchResults.gaps.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Gaps</h3>
                <div className="space-y-4">
                  {searchResults.gaps.map((g: any) => (
                    <div key={g.id} className="border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-lg font-medium text-pink-400">{g.title}</h4>
                      {g.description && <p className="text-slate-300 text-sm mt-1 line-clamp-2">{g.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Results */}
            {(activeTab === 'All' || activeTab === 'Academic Results') && academicResults && academicResults.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">Live Academic Search</h3>
                <div className="space-y-4">
                  {academicResults.map((r: any, idx: number) => (
                    <div key={idx} className="border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-blue-400 hover:underline flex items-center gap-2">
                        {r.title} <ExternalLink className="w-4 h-4" />
                      </a>
                      {r.authors && <p className="text-sm text-slate-400 mt-1">{r.authors.join(', ')}</p>}
                      {r.year && <p className="text-xs text-slate-500 mt-1">Year: {r.year} | Source: {r.source}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {searchResults && 
             (!searchResults.papers?.length) && 
             (!searchResults.problems?.length) && 
             (!searchResults.gaps?.length) && 
             (!academicResults?.length) && (
              <div className="text-center text-slate-400 py-8">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
