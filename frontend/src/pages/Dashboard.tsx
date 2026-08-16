import { StatsCard } from '@/components/ui/StatsCard';
import { BookOpen, HelpCircle, Network, TestTube, Users, Database } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function Dashboard() {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data.data;
    }
  });

  if (isLoading) {
    return <div className="text-white text-center py-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">Error loading dashboard</div>;
  }

  const stats = response?.stats || {};
  const recentPapers = response?.recentPapers || [];
  const activeProjects = response?.activeProjects || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back to your Research OS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Papers" value={stats.papers || 0} icon={<BookOpen />} />
        <StatsCard title="Problems" value={stats.problems || 0} icon={<HelpCircle />} />
        <StatsCard title="Gaps" value={stats.gaps || 0} icon={<Network />} />
        <StatsCard title="Experiments" value={stats.experiments || 0} icon={<TestTube />} />
        <StatsCard title="Researchers" value={stats.researchers || 0} icon={<Users />} />
        <StatsCard title="Datasets" value={stats.datasets || 0} icon={<Database />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Papers</h3>
          <div className="space-y-4">
            {recentPapers.length === 0 ? (
              <p className="text-slate-400 text-sm">No recent papers.</p>
            ) : (
              recentPapers.map((paper: any) => (
                <div key={paper.id} className="flex items-center gap-4 text-sm text-slate-300 border-b border-slate-700 pb-2 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <p className="truncate flex-1"><span className="font-medium text-white">{paper.title}</span></p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Active Projects</h3>
          <div className="space-y-4">
            {activeProjects.length === 0 ? (
              <p className="text-slate-400 text-sm">No active projects.</p>
            ) : (
              activeProjects.map((project: any) => (
                <div key={project.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{project.title}</h4>
                    <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full">Project</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
