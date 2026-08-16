import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockProjects = [
  { id: '1', title: 'Continual Learning Framework', status: 'active', date: 'Oct 2023 - Present', description: 'Developing a novel framework for continuous model adaptation.' },
  { id: '2', title: 'Sparse Neural Networks', status: 'planning', date: 'Starts Dec 2023', description: 'Investigating sparsity constraints on training efficiency.' },
];

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Research Projects</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" /> New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map(p => (
          <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="bg-slate-800 border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-white">{p.title}</h3>
              <StatusBadge status={p.status} />
            </div>
            <p className="text-sm text-slate-400 mb-6">{p.description}</p>
            <div className="flex items-center text-xs text-slate-500 gap-2">
              <Calendar className="w-3.5 h-3.5" /> {p.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
