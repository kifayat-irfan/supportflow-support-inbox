
import React from 'react';
import { OutboxMessage } from '../types';

interface OutboxProps {
  messages: OutboxMessage[];
}

const Outbox: React.FC<OutboxProps> = ({ messages }) => {
  const sorted = [...messages].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  return (
    <div className="p-8 h-full flex flex-col bg-slate-50/50">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mail Delivery Log</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">Audit trail of all automated and manual customer communications.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pb-10">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-dashed rounded-[2.5rem] border-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">No messages sent yet</h3>
            <p className="text-slate-400 max-w-xs mt-2 text-sm">Replied tickets will generate mail logs here for quality audit.</p>
          </div>
        ) : (
          sorted.map((msg, idx) => (
            <div 
              key={msg.id} 
              className={`bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-left-4 delay-${Math.min(idx * 50, 300)} duration-500`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <div className="flex items-center space-x-3 mb-2 md:mb-0">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100/50">
                    {msg.toEmail.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Recipient</span>
                    <span className="font-bold text-slate-800 text-sm">{msg.toEmail}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-right">
                  <div className="hidden sm:block">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                    <span className="flex items-center text-xs font-bold text-green-600">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      DELIVERED
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Sent Timestamp</span>
                    <span className="text-xs font-bold text-slate-600">{new Date(msg.sentAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 relative group-hover:bg-white transition-colors">
                <div className="absolute top-4 right-4 text-slate-200">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01705V13H12.017C13.6739 13 15.017 11.6569 15.017 10V5C15.017 3.34315 13.6739 2 12.017 2H5.01705C3.36019 2 2.01705 3.34315 2.01705 5V10C2.01705 11.6569 3.36019 13 5.01705 13H8.01705V16H5.01705C3.91248 16 3.01705 16.8954 3.01705 18V21H14.017Z" opacity="0.1" /></svg>
                </div>
                <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed relative z-10">{msg.content}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center transition-colors">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Verify Delivery Signature
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Outbox;
