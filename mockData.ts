
import { Role, TicketStatus, TicketPriority, Ticket, KBArticle, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 1, email: 'admin@supportflow.com', role: Role.ADMIN, name: 'Alex Admin' },
  { id: 2, email: 'agent@supportflow.com', role: Role.AGENT, name: 'Sam Agent' },
  { id: 3, email: 'kifayat@supportflow.com', role: Role.AGENT, name: 'Kifayat Engineer' }
];

export const INITIAL_KB: KBArticle[] = [
  {
    id: 1,
    title: 'Enterprise Refund Policy',
    body: 'Our refund policy allows customers to request a full refund within 30 days of purchase if they are unsatisfied with the product. For enterprise clients, pro-rated refunds are available for annual plans if cancelled within the first 60 days.',
    tags: ['billing', 'refund', 'policy', 'enterprise']
  },
  {
    id: 2,
    title: 'Password Security & Reset',
    body: 'To reset your password, go to the login page, click "Forgot Password", and enter your registered email address. Ensure your new password is at least 12 characters long and contains a mix of letters, numbers, and symbols.',
    tags: ['account', 'security', 'password']
  },
  {
    id: 3,
    title: 'Updating Billing Methods',
    body: 'You can add a new credit card or PayPal account in the Billing section of your dashboard settings. We support Visa, Mastercard, AMEX, and direct wire transfers for enterprise accounts.',
    tags: ['billing', 'payment', 'enterprise']
  },
  {
    id: 4,
    title: 'API Integration Guide',
    body: 'To integrate with our API, generate an API key from the Developer Settings. Our documentation supports REST and GraphQL endpoints with 99.9% uptime guaranteed.',
    tags: ['dev', 'api', 'integration']
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 101,
    subject: 'Urgent: Production API latency spikes',
    requesterEmail: 'dev-ops@fintech-ultra.com',
    status: TicketStatus.OPEN,
    priority: TicketPriority.URGENT,
    assignedId: 2,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 1,
        ticketId: 101,
        body: "We are seeing 500ms+ latency on the /v1/transactions endpoint since the last deploy. This is affecting our customer checkout experience. Please check the US-East load balancers.",
        fromAgent: false,
        authorName: 'David Ops',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      }
    ],
    notes: [
      {
        id: 1,
        ticketId: 101,
        body: 'Monitoring shows a sudden spike in DB connections. Investigating read-replica lag.',
        authorName: 'Alex Admin',
        createdAt: new Date(Date.now() - 600000).toISOString()
      }
    ]
  },
  {
    id: 102,
    subject: 'Cannot login to Dashboard - 403 Forbidden',
    requesterEmail: 'jane.doe@marketing-pro.io',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    assignedId: 3,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 2,
        ticketId: 102,
        body: "Every time I try to log in, I see a 403 Forbidden page. My teammates can log in just fine. I tried clearing my cookies but it didn't help.",
        fromAgent: false,
        authorName: 'Jane Doe',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    notes: []
  },
  {
    id: 103,
    subject: 'Clarification on Seat Add-on Pricing',
    requesterEmail: 'finance-lead@megacorp.com',
    status: TicketStatus.PENDING,
    priority: TicketPriority.MEDIUM,
    assignedId: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    messages: [
      {
        id: 3,
        ticketId: 103,
        body: "We want to add 50 more seats to our Enterprise plan mid-cycle. Will this be pro-rated or is there a bulk discount available for teams over 500?",
        fromAgent: false,
        authorName: 'Finance Lead',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 4,
        ticketId: 103,
        body: "Hi there, I'd be happy to check that for you. Generally, seat additions are pro-rated to the end of your billing cycle. I'm checking with our sales team for the bulk discount info.",
        fromAgent: true,
        authorName: 'Sam Agent',
        createdAt: new Date(Date.now() - 43200000).toISOString()
      }
    ],
    notes: [
      {
        id: 2,
        ticketId: 103,
        body: 'Sent query to Sales Dept regarding MegaCorp discount eligibility.',
        authorName: 'Sam Agent',
        createdAt: new Date(Date.now() - 40000000).toISOString()
      }
    ]
  },
  {
    id: 104,
    subject: 'Refund request for duplicate charge',
    requesterEmail: 'accounts@smallbiz.net',
    status: TicketStatus.ANSWERED,
    priority: TicketPriority.LOW,
    assignedId: 3,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: 5,
        ticketId: 104,
        body: "Hi, I noticed two identical charges of $149 on our June invoice. Can you please refund the duplicate one?",
        fromAgent: false,
        authorName: 'Accounting',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 6,
        ticketId: 104,
        body: "Hi! I've confirmed the duplicate charge and have issued a full refund of $149 for the second transaction. You should see it in your bank statement in 3-5 business days.",
        fromAgent: true,
        authorName: 'Kifayat Engineer',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    notes: []
  },
  {
    id: 105,
    subject: 'Request for custom SSO integration',
    requesterEmail: 'it-admin@enterprise-stack.com',
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    assignedId: 2,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 7,
        ticketId: 105,
        body: "We are moving our entire stack to Okta and need to set up custom SAML SSO for our support portal. Do you have a guide for this?",
        fromAgent: false,
        authorName: 'IT Admin',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ],
    notes: []
  },
  {
    id: 106,
    subject: 'Feature Request: Dark Mode for Dashboard',
    requesterEmail: 'ux-designer@creative-studio.com',
    status: TicketStatus.CLOSED,
    priority: TicketPriority.LOW,
    assignedId: 3,
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
    messages: [
      {
        id: 8,
        ticketId: 106,
        body: "I spend 8 hours a day in the dashboard. A dark mode option would be amazing for my eyes!",
        fromAgent: false,
        authorName: 'Designer Kim',
        createdAt: new Date(Date.now() - 604800000).toISOString()
      },
      {
        id: 9,
        ticketId: 106,
        body: "Great news! Dark mode is actually on our roadmap for Q4. I've added your vote to the feature request list. Closing this for now, but thanks for the feedback!",
        fromAgent: true,
        authorName: 'Kifayat Engineer',
        createdAt: new Date(Date.now() - 518400000).toISOString()
      }
    ],
    notes: []
  }
];
