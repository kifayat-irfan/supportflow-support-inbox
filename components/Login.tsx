
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const success = await onLogin(email);
    
    if (!success) {
      setError("We couldn't find an account with that email. Try the demo accounts below.");
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setError(null);
    setIsLoading(true);
    await onLogin(demoEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 transform transition-all hover:scale-[1.01]">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-xl shadow-blue-600/20">
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">SupportFlow</h1>
          <p className="text-slate-400 mt-2 font-medium">Enterprise Agent Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Work Email</label>
            <input 
              type="email" 
              required
              disabled={isLoading}
              className={`w-full px-5 py-3 rounded-2xl bg-slate-50 border transition-all font-medium focus:outline-none focus:ring-2 ${
                error ? 'border-red-300 ring-red-100' : 'border-slate-200 focus:ring-blue-500'
              }`}
              placeholder="agent@supportflow.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 font-semibold flex items-center">
                <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </p>
            )}
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              'Enter Workspace'
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Quick Access Roles</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleQuickLogin('admin@supportflow.com')}
              className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 transition-all active:bg-slate-200"
            >
              Admin Demo
            </button>
            <button 
              onClick={() => handleQuickLogin('agent@supportflow.com')}
              className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 transition-all active:bg-slate-200"
            >
              Agent Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
