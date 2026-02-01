
import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority, User } from '../types';

interface DashProps {
  tickets: Ticket[];
  currentUser: User;
}

const Dashboard: React.FC<DashProps> = ({ tickets, currentUser }) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [pulseValue, setPulseValue] = useState(75);

  // Simulate a live pulse for the presentation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseValue(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + change, 70), 85);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === TicketStatus.OPEN).length,
    pending: tickets.filter(t => t.status === TicketStatus.PENDING).length,
    urgent: tickets.filter(t => t.priority === TicketPriority.URGENT).length,
    assignedToMe: tickets.filter(t => t.assignedId === currentUser.id).length,
    resolved: tickets.filter(t => t.status === TicketStatus.ANSWERED || t.status === TicketStatus.CLOSED).length,
  };

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar relative bg-slate-50/50">
      <div className="flex justify-between items-start mb-8">
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome back, {currentUser.name}!</h1>
          <p className="text-slate-500 font-medium">Your support workspace is optimized and ready.</p>
        </div>
        <div className="flex space-x-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm text-[10px] font-bold text-slate-500 flex items-center tracking-widest uppercase">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                System Pulse: {pulseValue}%
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Volume', value: stats.total, color: 'blue', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
          { label: 'Active Open', value: stats.open, color: 'green', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
          { label: 'Urgent Action', value: stats.urgent, color: 'red', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
          { label: 'My Queue', value: stats.assignedToMe, color: 'indigo', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
        ].map((item, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-[2rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-in fade-in zoom-in-95 delay-${idx * 100}`}>
            <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <p className="text-4xl font-extrabold text-slate-900 tracking-tighter">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Recent Ticket Activity
            </h2>
            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-2 flex-1">
             {tickets.slice(0, 5).map((t, i) => (
               <div key={t.id} className={`flex items-center p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-default group border border-transparent hover:border-slate-100 animate-in fade-in slide-in-from-bottom-2 delay-${i * 50}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                    t.priority === TicketPriority.URGENT ? 'bg-red-50 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' :
                    t.priority === TicketPriority.HIGH ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    <span className="text-xs font-bold">{t.subject.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors truncate">{t.subject}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                        <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">{t.requesterEmail}</p>
                        <span className="text-slate-200 text-xs">•</span>
                        <span className={`text-[9px] font-extrabold uppercase tracking-tighter ${
                            t.status === TicketStatus.OPEN ? 'text-green-600' :
                            t.status === TicketStatus.PENDING ? 'text-amber-600' :
                            t.status === TicketStatus.ANSWERED ? 'text-blue-600' :
                            'text-slate-500'
                        }`}>
                            {t.status}
                        </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(t.updatedAt).toLocaleDateString()}</p>
                    <p className="text-[9px] text-slate-300 font-medium mt-0.5">Last update</p>
                  </div>
               </div>
             ))}
             {tickets.length === 0 && <p className="text-center py-10 text-slate-400 italic">No activity detected.</p>}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-[100px] group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <div className="bg-blue-600 p-1.5 rounded-lg mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              Gemini AI Impact
            </h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">Your enterprise AI has handled <span className="text-blue-400 font-bold">75% of initial drafts</span> this week, cutting your team's response time by nearly <span className="text-blue-400 font-bold">40%</span>.</p>
            
            <div className="space-y-6 flex-1">
              <div>
                <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-500 mb-2 uppercase">
                  <span>Manual Effort</span>
                  <span className="text-blue-400">AI Assisted (75%)</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-3 p-0.5">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.4)]" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time Saved</p>
                  <p className="text-2xl font-bold text-white">14.2 hrs</p>
                </div>
                <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Draft Accuracy</p>
                  <p className="text-2xl font-bold text-white">96.4%</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowAnalytics(true)}
              className="mt-8 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-blue-600/30 transition-all transform active:scale-95 group flex items-center justify-center"
            >
              Explore Efficiency Data
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm mb-10">
          <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Queue Performance Metrics
              </h2>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">30 Day Trend</span>
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-md">+12.4%</span>
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution Rate</p>
                    <span className="text-2xl font-black text-slate-900">{resolutionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full p-0.5 overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: `${resolutionRate}%` }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Target benchmark: 85%</p>
              </div>
              <div className="space-y-4 border-l border-slate-100 pl-10">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Response Time</p>
                    <span className="text-2xl font-black text-slate-900">1.4h</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full p-0.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Down from 2.2h last week</p>
              </div>
              <div className="space-y-4 border-l border-slate-100 pl-10">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer CSAT</p>
                    <span className="text-2xl font-black text-slate-900">4.8/5</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full p-0.5 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full transition-all duration-1000" style={{ width: '96%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Based on 142 reviews</p>
              </div>
          </div>
      </div>

      {showAnalytics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="p-10 border-b flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Insights</h2>
                <p className="text-slate-500 font-medium mt-1">Deep analysis of team output and customer satisfaction</p>
              </div>
              <button 
                onClick={() => setShowAnalytics(false)}
                className="p-3 hover:bg-slate-200 rounded-2xl text-slate-500 transition-all active:scale-90"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-slate-50 p-8 rounded-[2rem] border relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>
                   </div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Volume Trend</h3>
                   <div className="h-40 flex items-end justify-between px-2 gap-2">
                      {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-blue-600 rounded-t-xl transition-all duration-1000 ease-out shadow-sm" 
                            style={{ height: showAnalytics ? `${h}%` : '0%' }}
                          ></div>
                          <span className="text-[10px] font-bold text-slate-400 mt-3">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                          </span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border md:col-span-2">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">AI Accuracy & Trust Score</h3>
                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-slate-700">Content Quality</span>
                           <span className="text-sm font-bold text-green-600">98%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                           <div className="bg-green-500 h-full rounded-full transition-all duration-1000" style={{ width: '98%' }}></div>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold text-slate-700">Sentiment Match</span>
                           <span className="text-sm font-bold text-blue-600">92%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                           <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center border-l pl-10 border-slate-200">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                           <svg className="w-full h-full transform -rotate-90">
                              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-blue-600" strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - 0.94)} strokeLinecap="round" />
                           </svg>
                           <span className="absolute text-2xl font-black text-slate-900">9.4</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">AI Reliability Index</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-600/20 mb-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                      <h3 className="text-2xl font-bold mb-3">Predictive Resolution Insight</h3>
                      <p className="text-indigo-100 text-sm mb-6 leading-relaxed font-medium">
                        Based on current data, your team's busiest window will be <span className="text-white font-bold">tomorrow between 11 AM and 1 PM</span>. Gemini has prepared <span className="text-white font-bold">14 knowledge base updates</span> to proactively address upcoming trends in billing inquiries.
                      </p>
                      <div className="flex space-x-4">
                        <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/10 flex items-center">
                           <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                           <span className="text-xs font-bold tracking-tight">Optimal Staffing Level: 4 Agents</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 shrink-0">
                       <div className="bg-white/10 p-5 rounded-3xl border border-white/10 text-center backdrop-blur-sm">
                          <p className="text-3xl font-black mb-1">2.4m</p>
                          <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Team Time Saved</p>
                       </div>
                       <div className="bg-white/10 p-5 rounded-3xl border border-white/10 text-center backdrop-blur-sm">
                          <p className="text-3xl font-black mb-1">94%</p>
                          <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">KB Auto-Sync</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t flex justify-end">
               <button 
                onClick={() => setShowAnalytics(false)}
                className="bg-slate-900 text-white px-10 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
               >
                 Close Report
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
