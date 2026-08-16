import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white text-center">Global Search</h1>
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search across all entities..." 
          className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl pl-14 pr-6 py-4 text-lg text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-lg"
          autoFocus
        />
      </div>
      <div className="flex gap-4 justify-center text-sm">
        {['All', 'Papers', 'Problems', 'Projects', 'Notes'].map(t => (
          <label key={t} className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" defaultChecked={t==='All'} className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500" />
            {t}
          </label>
        ))}
      </div>
      <div className="pt-8 text-center text-slate-500">
        Enter a query to see results
      </div>
    </div>
  );
}
