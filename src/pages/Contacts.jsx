import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import ApperIcon from '../components/ApperIcon'
import ContactList from '../components/features/ContactList'
import ContactModal from '../components/features/ContactModal'
import FilterDropdown from '../components/common/FilterDropdown'
import { contactStatuses } from '../constants/crmConfig'
import { contactService } from '../services/contactService'
import { toast } from 'sonner'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)

  // Fetch contacts on component mount and when filters change
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoadingContacts(true)
      try {
        const filters = {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchTerm || undefined
        }
        const contactsData = await contactService.fetchAllContacts(filters)
        setContacts(contactsData || [])
      } catch (error) {
        console.error('Error fetching contacts:', error)
        toast.error('Failed to load contacts')
      } finally {
        setIsLoadingContacts(false)
      }
    }

    fetchContacts()
  }, [statusFilter, searchTerm]) // Re-fetch when filters change

  const handleAddContact = () => {
    setSelectedContact(null)
    setIsModalOpen(true)
  }

  const handleEditContact = (contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        // Update existing contact
        const updatedContact = await contactService.updateContact(selectedContact.Id, contactData)
        if (updatedContact) {
          // Update the contact in the local state
          setContacts(prevContacts => 
            prevContacts.map(contact => 
              contact.Id === selectedContact.Id ? updatedContact : contact
            )
          )
        }
      } else {
        // Create new contact
        const newContact = await contactService.createContact(contactData)
        if (newContact) {
          // Add the new contact to the local state
          setContacts(prevContacts => [newContact, ...prevContacts])
        }
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving contact:', error)
      // Error message is already shown by the service
    }
  }

  const handleDeleteContact = async (contactId) => {
    try {
      const success = await contactService.deleteContact(contactId)
      if (success) {
        // Remove the contact from local state
        setContacts(prevContacts => 
          prevContacts.filter(contact => contact.Id !== contactId)
        )
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      // Error message is already shown by the service
    }
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
        contacts={contacts}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        isLoading={isLoadingContacts}
      />

      <ContactModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        contact={selectedContact}
        onSave={handleSaveContact}
      />
    </div>
  )
}

export default Contacts