import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import ApperIcon from '../ApperIcon'
import { contactStatuses } from '../../constants/crmConfig'

const ContactList = ({ contacts, onEdit, onDelete }) => {
  const getStatusConfig = (status) => {
    return contactStatuses.find(s => s.value === status) || contactStatuses[0]
  }

const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || '?'}${lastName?.charAt(0) || '?'}`.toUpperCase()
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => {
        const statusConfig = getStatusConfig(contact.status)
        
        return (
<Card key={contact.Id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-crm-primary text-white">
{getInitials(contact.first_name, contact.last_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-semibold text-lg">
{contact.first_name} {contact.last_name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Mail" size={14} />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Phone" size={14} />
                        {contact.phone}
                      </span>
                    )}
                  </div>
                  {contact.company && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <ApperIcon name="Building2" size={14} />
                      {contact.position ? `${contact.position} at ${contact.company}` : contact.company}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={`bg-${statusConfig.color}/10 text-${statusConfig.color} border-${statusConfig.color}/20`}
                >
                  {statusConfig.label}
                </Badge>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(contact)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
onClick={() => onDelete(contact.Id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
      
      {contacts.length === 0 && (
        <Card className="p-12 text-center">
          <ApperIcon name="Users" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
          <p className="text-muted-foreground">
            Get started by adding your first contact or adjust your search filters.
          </p>
        </Card>
      )}
    </div>
  )
}

export default ContactList