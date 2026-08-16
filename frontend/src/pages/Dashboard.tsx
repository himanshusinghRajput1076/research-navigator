import { StatsCard } from '@/components/ui/StatsCard';
import { BookOpen, HelpCircle, Network, TestTube } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back to your Research OS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Active Projects" value="4" icon={<BookOpen />} trend={{value: 12, isPositive: true}} />
        <StatsCard title="Papers Read" value="128" icon={<BookOpen />} trend={{value: 5, isPositive: true}} />
        <StatsCard title="Open Problems" value="23" icon={<HelpCircle />} trend={{value: 2, isPositive: false}} />
        <StatsCard title="Experiments" value="7" icon={<TestTube />} trend={{value: 8, isPositive: true}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4 text-sm text-slate-300">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <p>Updated notes on <span className="font-medium text-white">Quantum ML Paper</span></p>
                <span className="text-slate-500 ml-auto">{i}h ago</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Current Focus</h3>
          <div className="space-y-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">Optimization in Deep Nets</h4>
                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">Project</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-4">
                <div className="bg-indigo-500 h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
