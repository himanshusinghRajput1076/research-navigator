import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, HelpCircle, Network, TestTube, Database, Code, Search, Settings, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const sections = [
    {
      label: 'Overview',
      items: [{ icon: LayoutDashboard, label: 'Dashboard', to: '/' }]
    },
    {
      label: 'Research',
      items: [
        { icon: BookOpen, label: 'Projects', to: '/projects' },
        { icon: FileText, label: 'Papers', to: '/papers' },
        { icon: Users, label: 'Researchers', to: '/researchers' }
      ]
    },
    {
      label: 'Analysis',
      items: [
        { icon: HelpCircle, label: 'Problems', to: '/problems' },
        { icon: Network, label: 'Gaps', to: '/gaps' }
      ]
    },
    {
      label: 'Lab',
      items: [
        { icon: TestTube, label: 'Experiments', to: '/experiments' },
        { icon: Database, label: 'Datasets', to: '/datasets' },
        { icon: Code, label: 'Algorithms', to: '/algorithms' }
      ]
    },
    {
      label: 'Tools',
      items: [
        { icon: FileText, label: 'Notes', to: '/notes' },
        { icon: Search, label: 'Search', to: '/search' }
      ]
    },
    {
      label: 'System',
      items: [
        { icon: Settings, label: 'Settings', to: '/settings' }
      ]
    }
  ];

  return (
    <aside className="w-[250px] flex-shrink-0 border-r border-slate-700 bg-slate-900 flex flex-col overflow-y-auto">
      <div className="h-16 flex items-center px-6 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="font-semibold text-lg text-white tracking-tight">Research OS</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h4 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {section.label}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-400" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
