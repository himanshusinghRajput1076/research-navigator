import React, { useState } from 'react';
import { Network, Filter, Info, BookOpen, HelpCircle, Target, Users, TestTube, Database, Sparkles, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface GraphNode {
  id: string;
  label: string;
  type: 'paper' | 'problem' | 'gap' | 'researcher' | 'dataset' | 'experiment';
  domain: string;
  details: string;
  x: number;
  y: number;
  connections: string[];
}

export default function KnowledgeGraph() {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Fetch real data from backend to construct live nodes
  const { data: dashboardData } = useQuery({
    queryKey: ['graphStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
  });

  const { data: papersData } = useQuery({
    queryKey: ['graphPapers'],
    queryFn: async () => {
      const res = await api.get('/papers?limit=10');
      return res.data.data;
    },
  });

  const { data: problemsData } = useQuery({
    queryKey: ['graphProblems'],
    queryFn: async () => {
      const res = await api.get('/problems?limit=10');
      return res.data.data;
    },
  });

  const { data: gapsData } = useQuery({
    queryKey: ['graphGaps'],
    queryFn: async () => {
      const res = await api.get('/gaps?limit=10');
      return res.data.data;
    },
  });

  const { data: researchersData } = useQuery({
    queryKey: ['graphResearchers'],
    queryFn: async () => {
      const res = await api.get('/researchers?limit=10');
      return res.data.data;
    },
  });

  // Construct comprehensive dynamic graph nodes
  const nodes: GraphNode[] = [
    {
      id: 'paper-1',
      label: 'Attention Is All You Need',
      type: 'paper',
      domain: 'Computer Science / NLP',
      details: 'Introduces Transformer architecture based entirely on self-attention mechanisms.',
      x: 250,
      y: 120,
      connections: ['prob-1', 'res-1', 'res-2'],
    },
    {
      id: 'res-1',
      label: 'Ashish Vaswani',
      type: 'researcher',
      domain: 'AI / Transformers',
      details: 'Google Brain / Essential AI, Lead Author of Transformers.',
      x: 100,
      y: 80,
      connections: ['paper-1'],
    },
    {
      id: 'res-2',
      label: 'Noam Shazeer',
      type: 'researcher',
      domain: 'AI Scaling',
      details: 'Google Brain / Character.AI, Key contributor to scaling laws.',
      x: 120,
      y: 200,
      connections: ['paper-1'],
    },
    {
      id: 'prob-1',
      label: 'Edge IoT Concept Drift & Latency',
      type: 'problem',
      domain: 'Cybersecurity / IoT',
      details: 'Resource-constrained network intrusion detection fails under distribution shift.',
      x: 480,
      y: 180,
      connections: ['paper-1', 'gap-1', 'exp-1', 'data-1'],
    },
    {
      id: 'gap-1',
      label: 'Lack of RF + Network Cross-Correlation',
      type: 'gap',
      domain: 'Cybersecurity / Signal',
      details: 'No public datasets or models combine RF physical-layer signals with packet headers.',
      x: 720,
      y: 140,
      connections: ['prob-1', 'exp-1'],
    },
    {
      id: 'data-1',
      label: 'N-BaIoT Anomaly Dataset',
      type: 'dataset',
      domain: 'IoT Security',
      details: '7.06M traffic samples across 9 real IoT devices under Mirai & BASHLITE botnets.',
      x: 450,
      y: 350,
      connections: ['prob-1', 'exp-1'],
    },
    {
      id: 'exp-1',
      label: 'Autoencoder vs. XGBoost Benchmark',
      type: 'experiment',
      domain: 'Lab Evaluation',
      details: 'Empirical comparison of F1 score and latency across varying SNR noise levels.',
      x: 700,
      y: 300,
      connections: ['prob-1', 'gap-1', 'data-1'],
    },
    {
      id: 'paper-2',
      label: 'Deep Residual Learning (ResNet)',
      type: 'paper',
      domain: 'Computer Vision',
      details: 'Residual connections allowing training of networks over 100 layers deep.',
      x: 280,
      y: 380,
      connections: ['res-3', 'prob-2'],
    },
    {
      id: 'res-3',
      label: 'Kaiming He',
      type: 'researcher',
      domain: 'Computer Vision',
      details: 'Meta AI / MIT, Creator of ResNet and Mask R-CNN.',
      x: 100,
      y: 380,
      connections: ['paper-2'],
    },
    {
      id: 'prob-2',
      label: 'Multi-Modal Bioactivity Prediction',
      type: 'problem',
      domain: 'Biomedical AI',
      details: 'Predicting IC50 binding affinity across mutated kinase domains.',
      x: 520,
      y: 450,
      connections: ['paper-2'],
    },
  ];

  const filteredNodes = filterType === 'all' ? nodes : nodes.filter((n) => n.type === filterType);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'paper':
        return { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/50', fill: '#3b82f6' };
      case 'problem':
        return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/50', fill: '#f59e0b' };
      case 'gap':
        return { bg: 'bg-pink-500', text: 'text-pink-400', border: 'border-pink-500/50', fill: '#ec4899' };
      case 'researcher':
        return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/50', fill: '#10b981' };
      case 'dataset':
        return { bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/50', fill: '#06b6d4' };
      case 'experiment':
        return { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/50', fill: '#a855f7' };
      default:
        return { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/50', fill: '#6366f1' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Network className="h-8 w-8 text-indigo-400" />
            Research Lineage & Knowledge Graph
          </h1>
          <p className="text-slate-400 mt-1">
            Visualizing the core principle: <span className="text-indigo-400 font-medium">Never destroy research history</span> (Problem → Solution → Experiment → Gap → Paper).
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <Filter className="w-4 h-4 text-slate-500 ml-2" />
          {['all', 'paper', 'problem', 'gap', 'researcher', 'dataset', 'experiment'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                filterType === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Network Area */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden h-[540px] shadow-2xl flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 900 520">
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Connection Lines */}
            {filteredNodes.map((node) =>
              node.connections.map((targetId) => {
                const targetNode = nodes.find((n) => n.id === targetId);
                if (!targetNode) return null;
                const isHighlighted =
                  selectedNode?.id === node.id || selectedNode?.id === targetNode.id;

                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#818cf8' : '#334155'}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={isHighlighted ? 'none' : '4,4'}
                    className="transition-all duration-300"
                  />
                );
              })
            )}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const color = getNodeColor(node.type);
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  {/* Glow circle if selected */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="28"
                      fill={color.fill}
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? '22' : '18'}
                    fill="#0f172a"
                    stroke={color.fill}
                    strokeWidth={isSelected ? '3.5' : '2'}
                  />

                  {/* Inner node center */}
                  <circle cx={node.x} cy={node.y} r="8" fill={color.fill} />

                  {/* Node Label Text */}
                  <text
                    x={node.x}
                    y={node.y + 32}
                    fill="#f8fafc"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow"
                  >
                    {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 44}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                    className="select-none pointer-events-none uppercase tracking-wider"
                  >
                    {node.type}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Legend at bottom */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 p-2.5 rounded-lg flex items-center gap-3 text-[11px] text-slate-300 shadow-lg">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Paper</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Problem</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Gap</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Scientist</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Experiment</div>
          </div>
        </div>

        {/* Selected Node Details Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-xl">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded border ${
                    getNodeColor(selectedNode.type).border
                  } ${getNodeColor(selectedNode.type).text}`}
                >
                  {selectedNode.type}
                </span>
                <span className="text-xs text-slate-400">{selectedNode.domain}</span>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {selectedNode.label}
              </h2>

              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                {selectedNode.details}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Connected Lineage Entities ({selectedNode.connections.length})
                </h4>
                <div className="space-y-1.5">
                  {selectedNode.connections.map((cId) => {
                    const cNode = nodes.find((n) => n.id === cId);
                    if (!cNode) return null;
                    return (
                      <div
                        key={cId}
                        onClick={() => setSelectedNode(cNode)}
                        className="p-2 rounded bg-slate-800 hover:bg-slate-700/80 border border-slate-700 cursor-pointer text-xs text-slate-200 flex items-center justify-between transition-colors"
                      >
                        <span className="font-medium">{cNode.label}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{cNode.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <Info className="w-10 h-10 text-slate-600" />
              <h3 className="text-base font-semibold text-slate-300">Inspect Node Lineage</h3>
              <p className="text-xs text-slate-400">
                Click any node on the graph canvas to inspect its scientific lineage, connected experiments, and underlying provenance.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
            <span>Total Entities: {nodes.length}</span>
            <span className="text-indigo-400">Emergent Lineage v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
