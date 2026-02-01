
import React from 'react';
import { User, Role } from '../types';

interface UserManagementProps {
  users: User[];
  onUpdateRole: (userId: number, role: Role) => void;
  currentUserId: number;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateRole, currentUserId }) => {
  return (
    <div className="p-8 h-full flex flex-col bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
        <p className="text-slate-500 text-sm mt-1">Manage user access roles and permissions</p>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Current Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900">{user.name} {user.id === currentUserId && "(You)"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user.role === Role.ADMIN ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {user.id !== currentUserId && (
                    <div className="flex justify-end space-x-2">
                      {user.role === Role.AGENT ? (
                        <button 
                          onClick={() => onUpdateRole(user.id, Role.ADMIN)}
                          className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Promote to Admin
                        </button>
                      ) : (
                        <button 
                          onClick={() => onUpdateRole(user.id, Role.AGENT)}
                          className="text-xs font-bold text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Demote to Agent
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
        <h3 className="text-sm font-bold text-indigo-900 mb-1">Admin Capabilities</h3>
        <p className="text-xs text-indigo-700 leading-relaxed">
          Admins can manage Knowledge Base articles, delete tickets, and manage team roles. 
          Use these permissions carefully to maintain system integrity.
        </p>
      </div>
    </div>
  );
};

export default UserManagement;
