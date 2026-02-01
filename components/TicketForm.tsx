
import React, { useState } from 'react';
import { TicketPriority } from '../types';

interface TicketFormProps {
  onSubmit: (data: {
    subject: string;
    requesterEmail: string;
    priority: TicketPriority;
    message: string;
  }) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    subject: '',
    requesterEmail: '',
    priority: TicketPriority.MEDIUM,
    message: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.subject.trim() || !formData.requesterEmail.trim() || !formData.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        subject: '',
        requesterEmail: '',
        priority: TicketPriority.MEDIUM,
        message: ''
      });
    } catch (err) {
      setError("An error occurred while creating the ticket. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Requester Email</label>
        <input 
          type="email"
          required
          disabled={isSubmitting}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm"
          placeholder="customer@example.com"
          value={formData.requesterEmail}
          onChange={e => setFormData({ ...formData, requesterEmail: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
          <div className="relative">
            <select 
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
            >
              {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subject</label>
          <input 
            type="text"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm"
            placeholder="Issue summary"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Description</label>
        <textarea 
          required
          disabled={isSubmitting}
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium text-sm resize-none"
          placeholder="Please describe the support request in detail..."
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
        ></textarea>
      </div>

      <div className="flex space-x-3 pt-2">
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-6 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : 'Submit Ticket'}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;
