import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import ApperIcon from '../ApperIcon'
import { opportunityStages } from '../../constants/crmConfig'
import { format } from 'date-fns'
import { toast } from 'sonner'

const OpportunityModal = ({ open, onOpenChange, opportunity, contacts, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    value: '',
    stage: 'lead',
    probability: '30',
    expectedCloseDate: new Date(),
    assignedTo: 'Alice Johnson',
    status: 'active'
  })

  useEffect(() => {
    if (opportunity) {
      setFormData({
        ...opportunity,
        expectedCloseDate: new Date(opportunity.expectedCloseDate)
      })
    } else {
      setFormData({
        title: '',
        contactId: '',
        value: '',
        stage: 'lead',
        probability: '30',
        expectedCloseDate: new Date(),
        assignedTo: 'Alice Johnson',
        status: 'active'
      })
    }
  }, [opportunity, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.contactId || !formData.value) {
      toast.error('Please fill in all required fields')
      return
    }

    const opportunityData = {
      ...formData,
      id: opportunity?.id || Date.now().toString(),
      value: parseFloat(formData.value),
      probability: parseInt(formData.probability),
      createdAt: opportunity?.createdAt || new Date()
    }

    onSave(opportunityData)
    toast.success(opportunity ? 'Opportunity updated successfully' : 'Opportunity created successfully')
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedContact = contacts.find(c => c.id === formData.contactId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {opportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Opportunity Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter opportunity title"
              required
            />
          </div>

          <div>
            <Label htmlFor="contactId">Contact *</Label>
            <Select value={formData.contactId} onValueChange={(value) => handleChange('contactId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select contact" />
</SelectTrigger>
<SelectContent>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName} - {contact.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleChange('probability', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage">Stage</Label>
              <Select value={formData.stage} onValueChange={(value) => handleChange('stage', value)}>
                <SelectTrigger>
                  <SelectValue />
</SelectTrigger>
<SelectContent>
                  {opportunityStages.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expected Close Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <ApperIcon name="Calendar" className="mr-2 h-4 w-4" />
                    {format(formData.expectedCloseDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expectedCloseDate}
                    onSelect={(date) => handleChange('expectedCloseDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="crm-gradient-bg hover:opacity-90">
              {opportunity ? 'Update Opportunity' : 'Create Opportunity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default OpportunityModal