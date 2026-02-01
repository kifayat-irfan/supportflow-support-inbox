
import React, { useState, useMemo, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { MOCK_USERS } from '../mockData';

interface FilterSnapshot {
  query: string;
  status: string;
  priority: string;
}

interface TicketListProps {
  tickets: Ticket[];
  onSelectTicket: (id: number) => void;
  onOpenNewTicketModal: () => void;
}

const PAGE_SIZE = 10;
const MAX_RECENT_FILTERS = 5;

const TicketList: React.FC<TicketListProps> = ({ tickets, onSelectTicket, onOpenNewTicketModal }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [recentFilters, setRecentFilters] = useState<FilterSnapshot[]>([]);

  // Load recent filters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('support_recent_filter_sets');
    if (saved) {
      try {
        setRecentFilters(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent filters", e);
      }
    }
  }, []);

  // Save recent filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('support_recent_filter_sets', JSON.stringify(recentFilters));
  }, [recentFilters]);

  // Handle adding a filter set to history
  const saveFilterToHistory = () => {
    const query = searchQuery.trim();
    if (query.length < 2 && filterStatus === 'All' && filterPriority === 'All') return;

    setRecentFilters(prev => {
      const filtered = prev.filter(f => 
        f.query.toLowerCase() !== query.toLowerCase() || 
        f.status !== filterStatus || 
        f.priority !== filterPriority
      );
      
      const newSnapshot: FilterSnapshot = { query, status: filterStatus, priority: filterPriority };
      return [newSnapshot, ...filtered].slice(0, MAX_RECENT_FILTERS);
    });
  };

  const handleApplyRecent = (snapshot: FilterSnapshot) => {
    setSearchQuery(snapshot.query);
    setFilterStatus(snapshot.status);
    setFilterPriority(snapshot.priority);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveFilterToHistory();
    }
  };

  const removeRecentFilter = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setRecentFilters(prev => prev.filter((_, i) => i !== index));
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
      const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.requesterEmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tickets, filterStatus, filterPriority, searchQuery]);

  const displayTickets = filteredTickets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTickets.length;

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-8 flex flex-col h-full bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Inbox</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time customer inquiry management</p>
        </div>
        <div className="flex items-center space-x-4">
            <button 
              onClick={onOpenNewTicketModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center transition-all active:scale-95"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Ticket
            </button>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                {filteredTickets.length} Result{filteredTickets.length !== 1 ? 's' : ''}
            </span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[240px]">
             <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search subject or requester email..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onBlur={saveFilterToHistory}
                />
             </div>
          </div>
          <select 
            className="px-4 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              if (searchQuery.trim().length > 0) setTimeout(saveFilterToHistory, 100);
            }}
          >
            <option value="All">All Statuses</option>
            {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            className="px-4 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value);
              if (searchQuery.trim().length > 0) setTimeout(saveFilterToHistory, 100);
            }}
          >
            <option value="All">All Priorities</option>
            {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {recentFilters.length > 0 && (
          <div className="mt-4 flex items-center space-x-3 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-shrink-0">Saved Views:</span>
            <div className="flex space-x-2">
              {recentFilters.map((f, index) => (
                <div 
                  key={index}
                  onClick={() => handleApplyRecent(f)}
                  className="group flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:border-blue-200 hover:bg-blue-50 transition-all animate-in fade-in slide-in-from-left-2"
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">
                      {f.query || "Filtered View"}
                    </span>
                    {(f.status !== 'All' || f.priority !== 'All') && (
                      <span className="text-[10px] text-slate-400 font-medium flex items-center">
                        <span className="mx-1">•</span>
                        {f.status !== 'All' && <span className="mr-1">{f.status}</span>}
                        {f.priority !== 'All' && <span>{f.priority}</span>}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={(e) => removeRecentFilter(e, index)}
                    className="ml-1 p-0.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setRecentFilters([])}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-tighter px-2"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Requester</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayTickets.map(ticket => {
                const assignedAgent = MOCK_USERS.find(u => u.id === ticket.assignedId);
                return (
                  <tr 
                    key={ticket.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => onSelectTicket(ticket.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{ticket.subject}</p>
                        {assignedAgent && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter shrink-0 border border-blue-100">
                            {assignedAgent.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">ID: #{ticket.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{ticket.requesterEmail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${assignedAgent ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-200 border-dashed'}`}>
                          {assignedAgent ? assignedAgent.name.charAt(0) : '?'}
                        </div>
                        <span className={`text-xs ${assignedAgent ? 'text-slate-700 font-medium' : 'text-slate-400 italic'}`}>
                          {assignedAgent ? assignedAgent.name : 'Unassigned'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ticket.status === TicketStatus.OPEN ? 'bg-green-100 text-green-700' :
                        ticket.status === TicketStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                        ticket.status === TicketStatus.ANSWERED ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ticket.priority === TicketPriority.URGENT ? 'bg-red-100 text-red-700' :
                        ticket.priority === TicketPriority.HIGH ? 'bg-orange-100 text-orange-700' :
                        ticket.priority === TicketPriority.MEDIUM ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{getTimeAgo(ticket.updatedAt)}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {hasMore && (
            <div className="p-8 flex justify-center border-t bg-slate-50/30">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setVisibleCount(prev => prev + PAGE_SIZE);
                }}
                className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-8 py-2.5 rounded-xl border border-blue-200 transition-all shadow-sm"
              >
                Load More Tickets
              </button>
            </div>
          )}

          {filteredTickets.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <svg className="w-12 h-12 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="font-medium text-slate-500">No tickets match your filters.</p>
              <button onClick={() => { setSearchQuery(''); setFilterStatus('All'); setFilterPriority('All'); }} className="mt-2 text-xs font-bold text-blue-600 hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketList;
