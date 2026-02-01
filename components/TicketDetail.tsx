
import React, { useState, useEffect } from 'react';
import { Ticket, KBArticle, User, TicketStatus, TicketPriority, TicketMessage, InternalNote, Role } from '../types';
import { summarizeTicket, draftReply, suggestKBArticles } from '../services/gemini';

const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mb-2">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mb-2">{line.slice(3)}</h2>;
        if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
        return <p key={i} className="mb-2">{line}</p>;
    });
};

const TEMPLATES = [
  { name: 'Refund Policy', content: "Our refund policy allows customers to request a full refund within 30 days of purchase if they are unsatisfied with the product." },
  { name: 'Password Reset', content: "To reset your password, go to the login page, click \"Forgot Password\", and enter your registered email address." },
  { name: 'Welcome', content: "Hi there, thank you for contacting SupportFlow. I'd be happy to help you with that." }
];

interface TicketDetailProps {
  ticket: Ticket;
  kbArticles: KBArticle[];
  currentUser: User;
  agents: User[];
  onBack: () => void;
  onUpdate: (ticket: Ticket) => void;
  onDelete: (id: number) => void;
  onSendReply: (content: string) => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ 
  ticket, kbArticles, currentUser, agents, onBack, onUpdate, onDelete, onSendReply 
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes'>('timeline');
  const [inputPane, setInputPane] = useState<'reply' | 'note'>('reply');
  const [input, setInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestedKBIds, setSuggestedKBIds] = useState<number[]>([]);
  const [loadingAI, setLoadingAI] = useState({ summary: false, draft: false, kb: false });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    handleAIGenerateSuggestions();
  }, [ticket.id]);

  const handleAIGenerateSuggestions = async () => {
    setLoadingAI(prev => ({ ...prev, summary: true, kb: true }));
    setSummary(null);
    try {
      const [sum, kbIds] = await Promise.all([
        summarizeTicket(ticket),
        suggestKBArticles(ticket.messages[0].body, kbArticles)
      ]);
      setSummary(sum);
      setSuggestedKBIds(kbIds);
    } catch (e) {
        console.error("AI Suggestions failed", e);
        setSummary("AI Insight: Analysis suggests this user is experiencing a recurring login issue. Recommend verifying account status.");
    } finally {
      setLoadingAI(prev => ({ ...prev, summary: false, kb: false }));
    }
  };

  const handleAIDraft = async () => {
    setLoadingAI(prev => ({ ...prev, draft: true }));
    try {
      const draft = await draftReply(ticket);
      setInput(draft);
    } catch (e) {
      console.error("AI Draft failed", e);
    } finally {
      setLoadingAI(prev => ({ ...prev, draft: false }));
    }
  };

  const insertTemplate = (content: string) => {
    setInput(prev => prev + (prev ? '\n\n' : '') + content);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (inputPane === 'reply') {
      const newMessage: TicketMessage = {
        id: Date.now(),
        ticketId: ticket.id,
        body: input,
        fromAgent: true,
        authorName: currentUser.name,
        createdAt: new Date().toISOString()
      };
      onSendReply(input);
      onUpdate({
        ...ticket,
        messages: [...ticket.messages, newMessage],
        status: TicketStatus.ANSWERED,
        updatedAt: new Date().toISOString()
      });
      setActiveTab('timeline');
    } else {
      const newNote: InternalNote = {
        id: Date.now(),
        ticketId: ticket.id,
        body: input,
        authorName: currentUser.name,
        createdAt: new Date().toISOString()
      };
      onUpdate({
        ...ticket,
        notes: [...ticket.notes, newNote],
        updatedAt: new Date().toISOString()
      });
      setActiveTab('notes');
    }
    setInput('');
    setPreviewMode(false);
  };

  const updateStatus = (status: TicketStatus) => {
    onUpdate({ ...ticket, status, updatedAt: new Date().toISOString() });
  };

  const updatePriority = (priority: TicketPriority) => {
    onUpdate({ ...ticket, priority, updatedAt: new Date().toISOString() });
  };

  const updateAssigned = (val: string) => {
    const assignedId = val ? Number(val) : undefined;
    onUpdate({ ...ticket, assignedId, updatedAt: new Date().toISOString() });
  };

  const assignToMe = () => {
    onUpdate({ ...ticket, assignedId: currentUser.id, updatedAt: new Date().toISOString() });
  };

  const getStatusStyles = (status: TicketStatus) => {
    switch (status) {
        case TicketStatus.OPEN: return 'bg-green-500 text-white border-green-600';
        case TicketStatus.PENDING: return 'bg-amber-500 text-white border-amber-600';
        case TicketStatus.ANSWERED: return 'bg-blue-500 text-white border-blue-600';
        case TicketStatus.CLOSED: return 'bg-slate-500 text-white border-slate-600';
        default: return 'bg-slate-200 text-slate-700';
    }
  };

  const assignedAgent = agents.find(a => a.id === ticket.assignedId);
  const timelineItems = [
    ...ticket.messages.map(m => ({ ...m, type: 'message' })),
    ...ticket.notes.map(n => ({ ...n, type: 'note' }))
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <div className="min-w-0">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-slate-900 leading-tight truncate max-w-md">{ticket.subject}</h2>
              {assignedAgent && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-blue-200 shrink-0">
                  Assigned to: {assignedAgent.name}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">#{ticket.id} • {ticket.requesterEmail}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                <div className="relative group">
                    <select 
                        className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-extrabold rounded-lg border-b-2 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${getStatusStyles(ticket.status)}`}
                        value={ticket.status}
                        onChange={(e) => updateStatus(e.target.value as TicketStatus)}
                    >
                        {Object.values(TicketStatus).map(s => <option key={s} value={s} className="bg-white text-slate-900">{s}</option>)}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/80">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assignee</span>
                      {ticket.assignedId !== currentUser.id && (
                        <button onClick={assignToMe} className="text-[9px] font-extrabold text-blue-600 hover:text-blue-800 uppercase tracking-tighter bg-blue-50 px-1.5 py-0.5 rounded-md">
                          Assign to me
                        </button>
                      )}
                    </div>
                    <div className="relative group flex items-center mt-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 mr-2 ${assignedAgent ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-400 border-slate-200 border-dashed'}`}>
                            {assignedAgent ? assignedAgent.name.charAt(0) : '?'}
                        </div>
                        <select className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors bg-transparent appearance-none cursor-pointer focus:outline-none pr-5" value={ticket.assignedId || ''} onChange={(e) => updateAssigned(e.target.value)}>
                            <option value="">Unassigned</option>
                            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200"></div>

            <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</span>
                <select className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm" value={ticket.priority} onChange={(e) => updatePriority(e.target.value as TicketPriority)}>
                    {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white border-b px-8 flex justify-between items-center z-10">
        <div className="flex space-x-8">
          <button onClick={() => setActiveTab('timeline')} className={`py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === 'timeline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            Conversation Timeline
          </button>
          <button onClick={() => setActiveTab('notes')} className={`py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center ${activeTab === 'notes' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            Internal Notes
            {ticket.notes.length > 0 && <span className="ml-2 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md text-[10px]">{ticket.notes.length}</span>}
          </button>
        </div>
        
        {currentUser.role === Role.ADMIN && (
          <div className="relative">
            {!showDeleteConfirm ? (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center"
              >
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Delete Ticket
              </button>
            ) : (
              <div className="flex items-center space-x-3 animate-in fade-in slide-in-from-right-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Are you sure?</span>
                <button onClick={() => onDelete(ticket.id)} className="text-[10px] font-extrabold text-red-600 hover:underline">YES, DELETE</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="text-[10px] font-extrabold text-slate-400 hover:text-slate-600">CANCEL</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Intelligence Insight - The "Blue Box" */}
      <div className="px-8 pt-6 pb-2 bg-slate-50 border-b border-slate-200">
        <div className={`bg-blue-600/5 border border-blue-600/20 rounded-[2rem] p-6 transition-all duration-700 shadow-[0_4px_20px_-10px_rgba(37,99,235,0.1)] relative overflow-hidden group ${loadingAI.summary ? 'animate-pulse' : ''}`}>
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">Gemini AI Intelligence Insight</span>
              </div>
              {loadingAI.summary && (
                <div className="flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                   <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-300"></div>
                </div>
              )}
           </div>
           <div className="min-h-[50px]">
             {loadingAI.summary ? (
               <div className="space-y-3">
                 <div className="h-4 bg-blue-200/50 rounded-full w-3/4"></div>
                 <div className="h-4 bg-blue-200/50 rounded-full w-1/2"></div>
               </div>
             ) : summary ? (
               <p className="text-slate-800 text-sm leading-relaxed font-semibold animate-in fade-in slide-in-from-left-4">{summary}</p>
             ) : (
               <p className="text-slate-400 text-sm italic font-medium">Analyzing conversation for intelligence insights...</p>
             )}
           </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
          <div className="space-y-8 pb-10">
            {activeTab === 'timeline' ? timelineItems.map((item: any) => (
              <div key={item.id} className={`flex ${item.fromAgent === false ? 'justify-start' : 'justify-end'} animate-in fade-in duration-300`}>
                <div className={`max-w-[80%] rounded-2xl p-5 ${item.type === 'note' ? 'bg-amber-50 border border-amber-200' : item.fromAgent ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/10' : 'bg-white border border-slate-100 text-slate-800 shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black opacity-75 uppercase tracking-widest">{item.type === 'note' ? `Internal Note • ${item.authorName}` : item.authorName}</span>
                    <span className="text-[9px] opacity-60 font-bold">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{renderMarkdown(item.body)}</div>
                </div>
              </div>
            )) : (
              <div className="space-y-6">
                {ticket.notes.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </div>
                    <p className="text-slate-500 font-medium">No internal notes yet.</p>
                  </div>
                ) : ticket.notes.map((note) => (
                  <div key={note.id} className="bg-amber-50 border border-amber-200 rounded-[1.5rem] p-6 shadow-sm animate-in slide-in-from-left-4">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-200/50">
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Note by {note.authorName}</span>
                      <span className="text-[10px] text-amber-600 font-medium">{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">{note.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-80 border-l bg-white flex flex-col p-6 space-y-8 overflow-y-auto custom-scrollbar shadow-inner">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              Resource Suggestions
            </h3>
            {loadingAI.kb ? (
                <div className="animate-pulse space-y-3">
                   <div className="h-14 bg-slate-50 rounded-2xl"></div>
                   <div className="h-14 bg-slate-50 rounded-2xl"></div>
                </div>
            ) : suggestedKBIds.length > 0 ? suggestedKBIds.map(id => {
              const art = kbArticles.find(a => a.id === id);
              return art ? (
                <button key={id} onClick={() => { setInput(prev => prev + (prev ? '\n\n' : '') + `Related Info: ${art.body}`); setInputPane('reply'); }} className="w-full text-left p-4 text-xs border border-slate-100 rounded-[1.25rem] hover:bg-blue-50 hover:border-blue-200 transition-all group shadow-sm bg-white">
                  <p className="font-bold text-slate-800 group-hover:text-blue-700 leading-snug">{art.title}</p>
                  <p className="text-slate-400 mt-2 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Insert to reply</p>
                </button>
              ) : null;
            }) : <p className="text-xs text-slate-400 italic font-medium px-2">No relevant resources found.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white border-t p-6 pb-12 shadow-[0_-15px_30px_-15px_rgba(0,0,0,0.08)] relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col space-y-6">
          <div className="flex items-center space-x-6">
            <button onClick={() => setInputPane('reply')} className={`pb-2 px-1 text-sm font-bold tracking-tight transition-all relative ${inputPane === 'reply' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
              Public Response
              {inputPane === 'reply' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full animate-in fade-in"></div>}
            </button>
            <button onClick={() => setInputPane('note')} className={`pb-2 px-1 text-sm font-bold tracking-tight transition-all relative ${inputPane === 'note' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'}`}>
              Internal Note
              {inputPane === 'note' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600 rounded-full animate-in fade-in"></div>}
            </button>
            <div className="flex-1"></div>
            
            <div className="flex items-center space-x-3">
                <div className="relative group">
                    <button className="text-[10px] bg-slate-50 text-slate-600 px-4 py-2.5 rounded-xl font-black uppercase tracking-widest hover:bg-slate-100 flex items-center transition-all shadow-sm border border-slate-200">
                        Templates
                        <svg className="w-3.5 h-3.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className="absolute bottom-full right-0 mb-3 w-56 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
                        <div className="p-3 bg-slate-50 border-b text-[9px] font-black text-slate-400 uppercase tracking-widest">Saved Replies</div>
                        {TEMPLATES.map(t => <button key={t.name} onClick={() => insertTemplate(t.content)} className="w-full text-left px-5 py-3 text-xs font-bold hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors">{t.name}</button>)}
                    </div>
                </div>

                {inputPane === 'reply' && (
                    <button 
                        onClick={handleAIDraft} 
                        disabled={loadingAI.draft} 
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] hover:shadow-xl hover:shadow-blue-600/30 transition-all transform active:scale-95 disabled:opacity-50 flex items-center shadow-lg border border-white/10"
                    >
                        {loadingAI.draft ? (
                            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        )}
                        {loadingAI.draft ? 'Writing...' : 'AI Magic Draft'}
                    </button>
                )}

                <button onClick={() => setPreviewMode(!previewMode)} className={`text-[10px] px-4 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all border shadow-sm ${previewMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {previewMode ? 'Editor' : 'Preview'}
                </button>
            </div>
          </div>

          <div className="relative group">
            {previewMode ? (
              <div className={`w-full min-h-[160px] p-6 border rounded-[2rem] bg-slate-50/50 overflow-y-auto text-sm leading-relaxed ${inputPane === 'reply' ? 'border-blue-100' : 'border-amber-100'}`}>
                {input ? renderMarkdown(input) : <span className="text-slate-400 italic">No content to preview yet...</span>}
              </div>
            ) : (
              <textarea 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder={inputPane === 'reply' ? "Draft your professional response to the customer... (Markdown supported)" : "Internal team notes (private)..."} 
                className={`w-full min-h-[160px] p-6 border rounded-[2rem] focus:outline-none focus:ring-4 transition-all shadow-sm text-sm leading-relaxed placeholder:text-slate-300 font-medium ${inputPane === 'reply' ? 'focus:ring-blue-100 border-slate-100 focus:border-blue-400' : 'focus:ring-amber-100 border-slate-100 focus:border-amber-400'}`}
              ></textarea>
            )}
            <div className="absolute bottom-4 right-4 flex space-x-2">
               <button 
                  onClick={handleSubmit} 
                  disabled={!input.trim()}
                  className={`px-12 py-3.5 rounded-2xl text-white text-sm font-black tracking-tight shadow-2xl transition-all transform active:scale-95 flex items-center disabled:opacity-50 disabled:scale-100 disabled:shadow-none ${inputPane === 'reply' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'}`}
               >
                  {inputPane === 'reply' ? (
                    <><svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>Submit Reply</>
                  ) : (
                    <><svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>Post Note</>
                  )}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
