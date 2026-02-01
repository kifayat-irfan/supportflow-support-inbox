
import React from 'react';
import { AppNotification } from '../types';

interface NotificationsProps {
  notifications: AppNotification[];
  onMarkRead: (id: number) => void;
  onMarkAllRead: () => void;
  onViewTicket: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onMarkRead, onMarkAllRead, onViewTicket }) => {
  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-8 h-full flex flex-col bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications Center</h1>
          <p className="text-slate-500 text-sm mt-1">Stay updated on ticket assignments and activity</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={onMarkAllRead}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4 text-slate-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
            <p className="text-slate-500 max-w-xs mt-2">You don't have any notifications right now. New activity will appear here.</p>
          </div>
        ) : (
          sorted.map(notif => (
            <div 
              key={notif.id}
              onClick={() => {
                if (!notif.read) onMarkRead(notif.id);
                if (notif.ticketId) onViewTicket(notif.ticketId);
              }}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative group flex items-start space-x-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
                notif.read ? 'bg-white border-slate-100 opacity-75' : 'bg-white border-blue-100 shadow-sm ring-1 ring-blue-50'
              } hover:shadow-md hover:border-blue-200`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.read ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className={`text-sm leading-relaxed ${notif.read ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>
                    {notif.message}
                  </p>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 ml-4 mt-1.5"></div>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{timeAgo(notif.createdAt)}</span>
                  {notif.ticketId && (
                    <>
                      <span className="text-slate-200 text-xs">•</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">View Ticket</span>
                    </>
                  )}
                </div>
              </div>
              {!notif.read && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead(notif.id);
                  }}
                  className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-400 hover:text-blue-600"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
