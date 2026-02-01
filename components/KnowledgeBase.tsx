
import React, { useState } from 'react';
import { KBArticle } from '../types';

interface KBProps {
  articles: KBArticle[];
  isAdmin: boolean;
  onAdd: (art: Omit<KBArticle, 'id'>) => void;
  onDelete: (id: number) => void;
  onUpdate: (art: KBArticle) => void;
}

const KnowledgeBase: React.FC<KBProps> = ({ articles, isAdmin, onAdd, onDelete, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editForm, setEditForm] = useState<Omit<KBArticle, 'id'>>({ title: '', body: '', tags: [] });

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.body.toLowerCase().includes(search.toLowerCase()) ||
    a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = () => {
    if (!editForm.title.trim() || !editForm.body.trim()) return;
    if (isEditing) {
      onUpdate({ ...editForm, id: isEditing } as KBArticle);
      setIsEditing(null);
    } else {
      onAdd(editForm);
      setShowAdd(false);
    }
    setEditForm({ title: '', body: '', tags: [] });
  };

  const startEdit = (a: KBArticle) => {
    setEditForm({ title: a.title, body: a.body, tags: a.tags });
    setIsEditing(a.id);
  };

  return (
    <div className="p-8 flex flex-col h-full bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="text-slate-500 text-sm mt-1">Documentation and self-service resources</p>
        </div>
        {isAdmin && !showAdd && !isEditing && (
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center transition-all active:scale-95"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            New Article
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative max-w-xl">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
                type="text" 
                placeholder="Search articles by title, content, or tags..." 
                className="w-full pl-12 pr-4 py-3 bg-white border rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {(showAdd || isEditing) && (
        <div className="bg-white border rounded-[2rem] p-8 mb-10 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-6 text-slate-900">{isEditing ? 'Edit Article' : 'Compose New Article'}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Article Title</label>
              <input 
                type="text" placeholder="e.g. How to manage billing cycles" 
                className="w-full p-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Body Content</label>
              <textarea 
                placeholder="Detailed documentation..." 
                className="w-full p-3.5 bg-slate-50 border rounded-xl h-60 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
                value={editForm.body} onChange={e => setEditForm({...editForm, body: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tags (separate by comma)</label>
              <input 
                type="text" placeholder="billing, security, guide" 
                className="w-full p-3.5 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={editForm.tags.join(', ')} onChange={e => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
              />
            </div>
            <div className="flex space-x-3 justify-end pt-4">
              <button onClick={() => { setShowAdd(false); setIsEditing(null); setEditForm({title:'', body:'', tags:[]}); }} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors">Discard</button>
              <button onClick={handleSave} className="px-10 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                {isEditing ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar flex-1 pb-10">
        {filtered.map(art => (
          <div key={art.id} className="bg-white p-6 rounded-2xl border hover:shadow-lg transition-all group relative flex flex-col h-fit">
            <h3 className="font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{art.title}</h3>
            <p className="text-slate-600 text-sm line-clamp-4 mb-6 leading-relaxed flex-1">{art.body}</p>
            <div className="flex flex-wrap gap-1.5">
              {art.tags.map(t => (
                <span key={t} className="bg-slate-100 text-slate-500 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border border-slate-200">
                  {t}
                </span>
              ))}
            </div>
            {isAdmin && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button onClick={() => startEdit(art)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg bg-white border shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button onClick={() => onDelete(art.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg bg-white border shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4 text-slate-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <p className="text-slate-500 font-medium">No articles found matching "{search}"</p>
            <button onClick={() => setSearch('')} className="mt-2 text-blue-600 text-sm font-bold hover:underline">Show all articles</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
