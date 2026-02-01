
import React from 'react';
import CreateTicketForm from './CreateTicketForm';

interface NewTicketModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">New Support Ticket</h2>
            <p className="text-slate-500 text-sm">Fill out the details to log a new request.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-8">
          <CreateTicketForm onSuccess={onClose} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default NewTicketModal;
