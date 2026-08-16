import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Plus, Target, HelpCircle, TestTube, BookOpen, Bot, User, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import api from '@/services/api';
import { useCreateGap } from '@/hooks/useGaps';
import { useCreateProblem } from '@/hooks/useProblems';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  engine?: string;
}

export default function GapFinder() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `### Welcome to the Emergent Research Gap Finder & AI Copilot 🔬\n\nI analyze academic literature across 9 scientific domains to uncover **unaddressed research gaps, methodological bottlenecks, and novel experiment directions**.\n\n**Select a prompt below or ask any research question:**`,
      timestamp: new Date().toLocaleTimeString(),
      engine: 'Emergent Scientific Reasoning Engine',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedGapTitle, setSavedGapTitle] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createGap = useCreateGap();
  const createProblem = useCreateProblem();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    {
      title: '🔍 Uncover Literature Gaps',
      query: 'Identify the top 3 unaddressed research gaps in IoT network anomaly detection under adversarial evasion.',
    },
    {
      title: '💡 Generate High-Impact Hypothesis',
      query: 'Formulate a testable scientific hypothesis to improve transformer latency on microcontrollers by 40%.',
    },
    {
      title: '🧪 Design Experiment Protocol',
      query: 'Design an end-to-end experimental protocol with baselines, variables, and metrics for edge concept drift evaluation.',
    },
    {
      title: '🔄 Methodology Crossover',
      query: 'How can RF physical layer fingerprinting techniques be transferred to zero-day botnet detection?',
    },
  ];

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!overrideText) setInput('');
    setLoading(true);

    try {
      const payload = newMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await api.post('/ai/chat', { messages: payload });
      const replyData = res.data.data;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyData.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString(),
        engine: replyData.engine || 'Emergent Scientific Engine',
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error communicating with AI engine. Please ensure your backend is active.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsGap = async (content: string) => {
    try {
      const firstLine = content.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'AI Discovered Research Gap';
      const title = firstLine.length > 80 ? firstLine.slice(0, 80) + '...' : firstLine;

      await createGap.mutateAsync({
        title: `Gap: ${title}`,
        gap_statement: content.slice(0, 500),
        confidence_score: 8,
        novelty_estimate: 9,
        impact_estimate: 8,
        field_id: '00000000-0000-0000-0000-000000000000',
      });
      setSavedGapTitle(title);
      setTimeout(() => setSavedGapTitle(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveAsProblem = async (content: string) => {
    try {
      const firstLine = content.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').trim() || 'AI Formulated Research Problem';
      const title = firstLine.length > 80 ? firstLine.slice(0, 80) + '...' : firstLine;

      await createProblem.mutateAsync({
        title: `Problem: ${title}`,
        description: content.slice(0, 500),
        difficulty_level: 'ADVANCED',
        impact_score: 8,
        novelty_score: 8,
        field_id: '00000000-0000-0000-0000-000000000000',
      });
      setSavedGapTitle(`Saved Problem: ${title}`);
      setTimeout(() => setSavedGapTitle(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Emergent Gap Finder & AI Copilot
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-normal px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Scientific Intelligence
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Automated Literature Synthesis • Contradiction Mapping • Hypothesis Formulation
            </p>
          </div>
        </div>

        {savedGapTitle && (
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <CheckCircle className="w-4 h-4" />
            <span>Added to Research Database!</span>
          </div>
        )}
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-xl">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-xl p-4 space-y-2 text-sm ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-sans">{m.content}</div>

                {m.role === 'assistant' && m.id !== '1' && (
                  <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-indigo-300/80">{m.engine}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveAsGap(m.content)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium transition-colors"
                      >
                        <Target className="w-3 h-3" /> Save to Gaps
                      </button>
                      <button
                        onClick={() => handleSaveAsProblem(m.content)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-medium transition-colors"
                      >
                        <HelpCircle className="w-3 h-3" /> Save as Problem
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <span>Synthesizing scientific literature and extracting research gaps...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        {messages.length <= 2 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Emergent Gap Discovery Blueprints:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.query)}
                  className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 transition-all flex items-center justify-between group"
                >
                  <span className="font-medium text-white">{p.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-slate-800 bg-slate-900 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a scientific query, paste an abstract to find gaps, or formulate an experiment..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
