
import React, { useState, useEffect } from 'react';
import { 
  User, Role, Ticket, KBArticle, TicketStatus, TicketPriority, OutboxMessage, AppNotification
} from './types';
import { MOCK_USERS, INITIAL_TICKETS, INITIAL_KB } from './mockData';
import Sidebar from './components/Sidebar';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import KnowledgeBase from './components/KnowledgeBase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewTicketModal from './components/NewTicketModal';
import Notifications from './components/Notifications';
import UserManagement from './components/UserManagement';
import Outbox from './components/Outbox';

const api = {
  getTickets: async () => {
    const saved = localStorage.getItem('support_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  },
  login: async (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    // We check against local storage first if users were modified
    const savedUsers = localStorage.getItem('support_users');
    const usersList: User[] = savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
    const user = usersList.find(u => u.email.toLowerCase() === cleanEmail);
    return user ? { user, token: 'simulated-jwt' } : null;
  }
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [kbArticles, setKbArticles] = useState<KBArticle[]>([]);
  const [outbox, setOutbox] = useState<OutboxMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tickets' | 'kb' | 'outbox' | 'notifications' | 'users'>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  const sortTickets = (data: Ticket[]) => {
    return [...data].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedTickets = await api.getTickets();
        const savedKB = localStorage.getItem('support_kb');
        const savedUser = localStorage.getItem('support_user');
        const savedUsers = localStorage.getItem('support_users');
        const savedOutbox = localStorage.getItem('support_outbox');
        const savedNotifications = localStorage.getItem('support_notifications');
        
        const currentUsersList = savedUsers ? JSON.parse(savedUsers) : MOCK_USERS;
        setUsers(currentUsersList);
        setTickets(sortTickets(fetchedTickets));
        setKbArticles(savedKB ? JSON.parse(savedKB) : INITIAL_KB);
        
        // Seed professional notifications
        if (!savedNotifications) {
          const initialNotifs: AppNotification[] = [
            { id: 1, userId: 2, message: "NEW URGENT TICKET: Production API latency spikes (#101)", ticketId: 101, read: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
            { id: 2, userId: 3, message: "New High Priority Ticket #102 assigned to you: 'Login 403 Forbidden'", ticketId: 102, read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
            { id: 3, userId: 2, message: "Customer IT Admin updated Ticket #105: 'Custom SSO integration'", ticketId: 105, read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
            { id: 4, userId: 3, message: "Knowledge Base Alert: Your article 'Password Security' was updated by Admin.", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
            { id: 5, userId: 2, message: "Billing inquiry from MegaCorp (#103) is approaching SLA deadline.", ticketId: 103, read: true, createdAt: new Date(Date.now() - 129600000).toISOString() },
            { id: 6, userId: 1, message: "SYSTEM: Weekly support efficiency report is ready.", read: false, createdAt: new Date(Date.now() - 43200000).toISOString() }
          ];
          setNotifications(initialNotifs);
        } else {
          setNotifications(JSON.parse(savedNotifications));
        }

        // Seed Outbox history with realistic enterprise communications
        if (!savedOutbox) {
          const initialOutbox: OutboxMessage[] = [
            { 
              id: 1, 
              toEmail: 'accounts@smallbiz.net', 
              content: "Hi there,\n\nI've confirmed the duplicate charge and have issued a full refund of $149 for the second transaction. You should see it in your bank statement in 3-5 business days.\n\nBest regards,\nSupportFlow Billing Team", 
              sentAt: new Date(Date.now() - 86400000).toISOString() 
            },
            { 
              id: 2, 
              toEmail: 'ux-designer@creative-studio.com', 
              content: "Hi Designer Kim,\n\nGreat news! Dark mode is actually on our roadmap for Q4. I've added your vote to the feature request list. Closing this for now, but thanks for the feedback!\n\nCheers,\nSupportFlow Product Team", 
              sentAt: new Date(Date.now() - 518400000).toISOString() 
            },
            { 
              id: 3, 
              toEmail: 'finance-lead@megacorp.com', 
              content: "Hi Finance Lead,\n\nGenerally, seat additions are pro-rated to the end of your billing cycle. I'm checking with our sales team for the bulk discount info you requested.\n\nI will get back to you by EOD tomorrow with the final quote.", 
              sentAt: new Date(Date.now() - 43200000).toISOString() 
            },
            { 
              id: 4, 
              toEmail: 'it-admin@enterprise-stack.com', 
              content: "Hi IT Admin,\n\nI've reviewed your request for the Okta SAML integration. You can find the step-by-step guide in our Knowledge Base under 'API & Integrations'.\n\nLet us know if you hit any snags during the configuration!", 
              sentAt: new Date(Date.now() - 10800000).toISOString() 
            },
            { 
              id: 5, 
              toEmail: 'dev-ops@fintech-ultra.com', 
              content: "Hi David,\n\nOur engineering team has identified the cause of the latency spikes. It was a configuration drift in the US-East load balancer cluster. We have rolled back the change and performance is now baseline.\n\nThank you for alerting us.", 
              sentAt: new Date(Date.now() - 1800000).toISOString() 
            }
          ];
          setOutbox(initialOutbox);
        } else {
          setOutbox(JSON.parse(savedOutbox));
        }
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          const validUser = currentUsersList.find((u: User) => u.id === parsedUser.id);
          if (validUser) setCurrentUser(validUser);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (tickets.length > 0) localStorage.setItem('support_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    if (kbArticles.length > 0) localStorage.setItem('support_kb', JSON.stringify(kbArticles));
  }, [kbArticles]);

  useEffect(() => {
    localStorage.setItem('support_outbox', JSON.stringify(outbox));
  }, [outbox]);

  useEffect(() => {
    localStorage.setItem('support_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('support_users', JSON.stringify(users));
  }, [users]);

  const handleLogin = async (email: string): Promise<boolean> => {
    const res = await api.login(email);
    if (res) {
      setCurrentUser(res.user);
      localStorage.setItem('support_user', JSON.stringify(res.user));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('support_user');
    setActiveTab('dashboard');
    setSelectedTicketId(null);
  };

  const addNotification = (userId: number, message: string, ticketId?: number) => {
    const newNotif: AppNotification = {
      id: Date.now(),
      userId,
      message,
      ticketId,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => {
      const oldTicket = prev.find(t => t.id === updatedTicket.id);
      if (oldTicket && oldTicket.assignedId !== updatedTicket.assignedId && updatedTicket.assignedId) {
        const agent = users.find(u => u.id === updatedTicket.assignedId);
        if (agent) {
          addNotification(agent.id, `Ticket #${updatedTicket.id} ("${updatedTicket.subject}") has been assigned to you.`, updatedTicket.id);
        }
      }
      const newTickets = prev.map(t => t.id === updatedTicket.id ? { ...updatedTicket, updatedAt: new Date().toISOString() } : t);
      return sortTickets(newTickets);
    });
  };

  const deleteTicket = (id: number) => {
    if (currentUser?.role !== Role.ADMIN) return;
    setTickets(prev => prev.filter(t => t.id !== id));
    setSelectedTicketId(null);
  };

  const updateUserRole = (userId: number, newRole: Role) => {
    if (currentUser?.role !== Role.ADMIN) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    // If we update the current user, update their state too
    if (currentUser?.id === userId) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      localStorage.setItem('support_user', JSON.stringify(updated));
    }
  };

  const handleCreateNewTicket = async (data: {
    subject: string;
    requesterEmail: string;
    priority: TicketPriority;
    message: string;
  }) => {
    const newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 107;
    const newTicket: Ticket = {
      id: newId,
      subject: data.subject,
      requesterEmail: data.requesterEmail,
      priority: data.priority,
      status: TicketStatus.OPEN,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        id: Date.now(),
        ticketId: newId, 
        body: data.message,
        fromAgent: false,
        authorName: data.requesterEmail.split('@')[0],
        createdAt: new Date().toISOString()
      }],
      notes: []
    };
    setTickets(prev => sortTickets([newTicket, ...prev]));
  };

  const addOutboxMessage = (to: string, content: string) => {
    const msg: OutboxMessage = {
      id: Date.now(),
      toEmail: to,
      content,
      sentAt: new Date().toISOString()
    };
    setOutbox(prev => [msg, ...prev]);
  };

  const addKbArticle = (article: Omit<KBArticle, 'id'>) => {
    if (currentUser?.role !== Role.ADMIN) return;
    const newArticle = { ...article, id: Date.now() };
    setKbArticles(prev => [newArticle, ...prev]);
  };

  const deleteKbArticle = (id: number) => {
    if (currentUser?.role !== Role.ADMIN) return;
    setKbArticles(prev => prev.filter(a => a.id !== id));
  };

  const updateKbArticle = (article: KBArticle) => {
    if (currentUser?.role !== Role.ADMIN) return;
    setKbArticles(prev => prev.map(a => a.id === article.id ? article : a));
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;
  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Loading workspace...</p>
    </div>
  );

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setSelectedTicketId(null); }} 
        currentUser={currentUser} 
        onLogout={handleLogout}
        unreadNotifications={unreadCount}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-300">
        {activeTab === 'dashboard' && <Dashboard tickets={tickets} currentUser={currentUser} />}
        
        {activeTab === 'tickets' && !selectedTicketId && (
          <TicketList 
            tickets={tickets} 
            onSelectTicket={setSelectedTicketId}
            onOpenNewTicketModal={() => setIsNewTicketModalOpen(true)}
          />
        )}
        
        {activeTab === 'tickets' && selectedTicketId && selectedTicket && (
          <TicketDetail 
            ticket={selectedTicket} 
            kbArticles={kbArticles}
            onBack={() => setSelectedTicketId(null)} 
            onUpdate={updateTicket}
            onDelete={deleteTicket}
            onSendReply={(content) => addOutboxMessage(selectedTicket.requesterEmail, content)}
            currentUser={currentUser}
            agents={users}
          />
        )}
        
        {activeTab === 'kb' && (
          <KnowledgeBase 
            articles={kbArticles} 
            isAdmin={currentUser.role === Role.ADMIN}
            onAdd={addKbArticle}
            onDelete={deleteKbArticle}
            onUpdate={updateKbArticle}
          />
        )}

        {activeTab === 'users' && currentUser.role === Role.ADMIN && (
          <UserManagement 
            users={users} 
            onUpdateRole={updateUserRole} 
            currentUserId={currentUser.id}
          />
        )}

        {activeTab === 'outbox' && (
          <Outbox messages={outbox} />
        )}

        {activeTab === 'notifications' && (
          <Notifications 
            notifications={notifications.filter(n => n.userId === currentUser.id)}
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllNotificationsRead}
            onViewTicket={(id) => {
              setSelectedTicketId(id);
              setActiveTab('tickets');
            }}
          />
        )}
      </main>

      {isNewTicketModalOpen && (
        <NewTicketModal 
          onClose={() => setIsNewTicketModalOpen(false)}
          onSubmit={handleCreateNewTicket}
        />
      )}
    </div>
  );
};

export default App;
