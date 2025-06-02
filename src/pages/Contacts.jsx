import { useState } from 'react'
import { useCRM } from '../context/CRMContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import ApperIcon from '../components/ApperIcon'
import ContactList from '../components/features/ContactList'
import ContactModal from '../components/features/ContactModal'
import FilterDropdown from '../components/common/FilterDropdown'
import { contactStatuses } from '../constants/crmConfig'

const Contacts = () => {
  const { state, dispatch } = useCRM()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredContacts = state.contacts.filter(contact => {
    const matchesSearch = `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.company}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleAddContact = () => {
    setSelectedContact(null)
    setIsModalOpen(true)
  }

  const handleEditContact = (contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships and contact information.
          </p>
        </div>
        <Button onClick={handleAddContact} className="crm-gradient-bg hover:opacity-90">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            size={16} 
          />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <FilterDropdown
          options={[
            { value: 'all', label: 'All Statuses' },
            ...contactStatuses
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
        />
      </div>

      <ContactList
        contacts={filteredContacts}
        onEdit={handleEditContact}
        onDelete={(id) => dispatch({ type: 'DELETE_CONTACT', payload: id })}
      />

      <ContactModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        contact={selectedContact}
        onSave={(contact) => {
          if (selectedContact) {
            dispatch({ type: 'UPDATE_CONTACT', payload: contact })
          } else {
            dispatch({ type: 'ADD_CONTACT', payload: contact })
          }
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default Contacts