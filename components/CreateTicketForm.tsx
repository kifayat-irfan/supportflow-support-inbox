
import React, { useState } from 'react';
import { TicketPriority } from '../types';

interface CreateTicketFormProps {
  onSuccess?: () => void;
  onSubmit: (data: {
    subject: string;
    requesterEmail: string;
    priority: TicketPriority;
    message: string;
  }) => Promise<void>;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onSuccess, onSubmit }) => {
  const [formData, setFormData] = useState({
    subject: '',
    requesterEmail: '',
    priority: TicketPriority.MEDIUM,
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    try {
      // Validate inputs
      if (!formData.subject.trim() || !formData.requesterEmail.trim() || !formData.message.trim()) {
        throw new Error("Please fill in all required fields.");
      }

      // Call the parent onSubmit handler (handleCreateNewTicket in App.tsx)
      await onSubmit(formData);

      setStatus('success');
      setFormData({
        subject: '',
        requesterEmail: '',
        priority: TicketPriority.MEDIUM,
        message: ''
      });

      // Optional callback to close modals or refresh lists
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err: any) {
      console.error("Form submission error:", err);
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected error occurred.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Ticket Created!</h3>
        <p className="text-slate-500 mt-2">The support request has been logged successfully.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Create another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center animate-in slide-in-from-top-2 shadow-sm">
          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Requester Email</label>
          <input 
            type="email"
            required
            disabled={status === 'loading'}
            placeholder="customer@example.com"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm disabled:opacity-50"
            value={formData.requesterEmail}
            onChange={e => setFormData({ ...formData, requesterEmail: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subject</label>
            <input 
              type="text"
              required
              disabled={status === 'loading'}
              placeholder="What is the issue?"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm disabled:opacity-50"
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
            <div className="relative">
              <select 
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-bold text-sm appearance-none cursor-pointer disabled:opacity-50 pr-10"
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
              >
                {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Initial Message</label>
          <textarea 
            required
            disabled={status === 'loading'}
            rows={5}
            placeholder="Describe the problem in detail..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm disabled:opacity-50 resize-none"
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {status === 'loading' ? (
            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Submit Ticket'}
        </button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
