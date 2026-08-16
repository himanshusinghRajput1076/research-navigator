import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { Modal } from '@/components/ui/Modal';
import { FormField } from '@/components/ui/FormField';
import { Plus, BookMarked, Calendar, Tag, Lightbulb } from 'lucide-react';

export default function Notes() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState('observation');

  const { data, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await api.get('/notes');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/notes', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
      setTitle('');
      setContent('');
    },
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      title,
      content,
      note_type: noteType,
    });
  };

  const getNoteBadgeColor = (type: string) => {
    switch (type) {
      case 'observation': return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'hypothesis': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'decision': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BookMarked className="h-8 w-8 text-indigo-400" />
            Lab Notebook & Research Journal
          </h1>
          <p className="text-slate-400 mt-1">
            Chronological scientific log for observations, decisions, insights, and research history. Never overwritten.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="h-4 w-4" />
          Log Research Note
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-slate-400 text-center py-12">Loading research entries...</div>
        ) : (data?.data || []).length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Lightbulb className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white">Your Lab Notebook is Empty</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Record daily research observations, experimental notes, or hypothesis updates.
            </p>
          </div>
        ) : (
          (data?.data || []).map((note: any) => (
            <div key={note.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getNoteBadgeColor(note.note_type)}`}>
                  {note.note_type?.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(note.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{note.title || 'Untitled Entry'}</h3>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Scientific Observation / Note">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Observation: IoTGeM improves cross-dataset generalization"
          />
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Note Type</label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="observation">Observation</option>
              <option value="hypothesis">Hypothesis Formulation</option>
              <option value="decision">Methodological Decision</option>
              <option value="todo">Task / Experiment To-Do</option>
              <option value="general">General Memo</option>
            </select>
          </div>
          <FormField
            label="Content / Findings *"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe what you observed, calculated, or decided..."
            type="textarea"
            required
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-600/20"
            >
              {createMutation.isPending ? 'Logging...' : 'Save Note'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
