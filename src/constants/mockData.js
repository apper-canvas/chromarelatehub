export const mockContacts = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc',
    position: 'CTO',
    status: 'active',
    source: 'Website',
    assignedTo: 'Alice Johnson',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@cyberdyne.com',
    phone: '+1 (555) 987-6543',
    company: 'Cyberdyne Systems',
    position: 'VP Engineering',
    status: 'active',
    source: 'LinkedIn',
    assignedTo: 'Bob Wilson',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@innovate.co',
    phone: '+1 (555) 456-7890',
    company: 'Innovate Corp',
    position: 'Product Manager',
    status: 'lead',
    source: 'Referral',
    assignedTo: 'Alice Johnson',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  }
]

export const mockOpportunities = [
  {
    id: '1',
    title: 'Enterprise Software License',
    contactId: '1',
    value: 250000,
    stage: 'qualified',
    probability: 75,
    expectedCloseDate: new Date('2024-03-15'),
    assignedTo: 'Alice Johnson',
    status: 'active',
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Security Audit Services',
    contactId: '2',
    value: 85000,
    stage: 'proposal',
    probability: 60,
    expectedCloseDate: new Date('2024-02-28'),
    assignedTo: 'Bob Wilson',
    status: 'active',
    createdAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Product Integration',
    contactId: '3',
    value: 120000,
    stage: 'lead',
    probability: 30,
    expectedCloseDate: new Date('2024-04-10'),
    assignedTo: 'Alice Johnson',
    status: 'active',
    createdAt: new Date('2024-01-22')
  }
]

export const mockTasks = [
  {
    id: '1',
    title: 'Follow up on proposal',
    description: 'Call John Smith to discuss the enterprise license proposal and address any concerns',
    type: 'call',
    priority: 'high',
    dueDate: new Date('2024-01-30'),
    assignedTo: 'Alice Johnson',
    relatedTo: '1',
    completed: false,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '2',
    title: 'Send security documentation',
    description: 'Prepare and send security compliance documents to Sarah Connor',
    type: 'email',
    priority: 'medium',
    dueDate: new Date('2024-02-01'),
    assignedTo: 'Bob Wilson',
    relatedTo: '2',
    completed: false,
    createdAt: new Date('2024-01-24')
  },
  {
    id: '3',
    title: 'Schedule demo meeting',
    description: 'Set up product demo for Michael Chen and his team',
    type: 'meeting',
    priority: 'medium',
    dueDate: new Date('2024-02-05'),
    assignedTo: 'Alice Johnson',
    relatedTo: '3',
    completed: true,
    createdAt: new Date('2024-01-23')
  }
]

export const mockActivities = [
  {
    id: '1',
    type: 'email',
    contactId: '1',
    description: 'Sent proposal for enterprise software license',
    userId: 'Alice Johnson',
    timestamp: new Date('2024-01-25T10:30:00'),
    metadata: { subject: 'Enterprise License Proposal' }
  },
  {
    id: '2',
    type: 'call',
    contactId: '2',
    description: 'Discussed security requirements and timeline',
    userId: 'Bob Wilson',
    timestamp: new Date('2024-01-24T14:15:00'),
    metadata: { duration: '45 minutes' }
  },
  {
    id: '3',
    type: 'meeting',
    contactId: '3',
    description: 'Initial discovery call completed',
    userId: 'Alice Johnson',
    timestamp: new Date('2024-01-23T09:00:00'),
    metadata: { location: 'Video Conference' }
  }
]