export const contactStatuses = [
  { value: 'lead', label: 'Lead', color: 'crm-lead' },
  { value: 'qualified', label: 'Qualified', color: 'crm-qualified' },
  { value: 'active', label: 'Active', color: 'crm-success' },
  { value: 'inactive', label: 'Inactive', color: 'crm-closed-lost' }
]

export const opportunityStages = [
  { value: 'lead', label: 'Lead', color: 'crm-lead' },
  { value: 'qualified', label: 'Qualified', color: 'crm-qualified' },
  { value: 'proposal', label: 'Proposal', color: 'crm-proposal' },
  { value: 'negotiation', label: 'Negotiation', color: 'crm-negotiation' },
  { value: 'closed-won', label: 'Closed Won', color: 'crm-closed-won' },
  { value: 'closed-lost', label: 'Closed Lost', color: 'crm-closed-lost' }
]

export const taskTypes = [
  { value: 'call', label: 'Call', icon: 'Phone' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'meeting', label: 'Meeting', icon: 'Calendar' },
  { value: 'todo', label: 'To Do', icon: 'CheckSquare' }
]

export const taskPriorities = [
  { value: 'low', label: 'Low', color: 'text-gray-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'high', label: 'High', color: 'text-red-500' }
]

export const activityTypes = [
  { value: 'call', label: 'Call', icon: 'Phone' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'meeting', label: 'Meeting', icon: 'Calendar' },
  { value: 'note', label: 'Note', icon: 'FileText' }
]

export const contactFormConfig = {
  fields: [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', required: false },
    { name: 'company', label: 'Company', type: 'text', required: false },
    { name: 'position', label: 'Position', type: 'text', required: false },
    { name: 'source', label: 'Source', type: 'select', required: false }
  ]
}

export const opportunityFormConfig = {
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'contactId', label: 'Contact', type: 'select', required: true },
    { name: 'value', label: 'Value', type: 'number', required: true },
    { name: 'stage', label: 'Stage', type: 'select', required: true },
    { name: 'probability', label: 'Probability (%)', type: 'number', required: true },
    { name: 'expectedCloseDate', label: 'Expected Close Date', type: 'date', required: true }
  ]
}

export const taskFormConfig = {
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
    { name: 'type', label: 'Type', type: 'select', required: true },
    { name: 'priority', label: 'Priority', type: 'select', required: true },
    { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
    { name: 'relatedTo', label: 'Related Contact', type: 'select', required: false }
  ]
}