import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import ApperIcon from '../ApperIcon'
import { taskTypes, taskPriorities } from '../../constants/crmConfig'
import { format } from 'date-fns'
import { toast } from 'sonner'

const TaskModal = ({ open, onOpenChange, task, contacts, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'todo',
    priority: 'medium',
    dueDate: new Date(),
    assignedTo: 'Alice Johnson',
    relatedTo: '',
    completed: false
  })

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        dueDate: new Date(task.dueDate)
      })
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'todo',
        priority: 'medium',
        dueDate: new Date(),
        assignedTo: 'Alice Johnson',
        relatedTo: '',
        completed: false
      })
    }
  }, [task, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title) {
      toast.error('Please enter a task title')
      return
    }

    const taskData = {
      ...formData,
      id: task?.id || Date.now().toString(),
      createdAt: task?.createdAt || new Date()
    }

    onSave(taskData)
    toast.success(task ? 'Task updated successfully' : 'Task created successfully')
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <ApperIcon name={type.icon} size={14} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskPriorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <ApperIcon name="Calendar" className="mr-2 h-4 w-4" />
                  {format(formData.dueDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => handleChange('dueDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="relatedTo">Related Contact</Label>
            <Select value={formData.relatedTo} onValueChange={(value) => handleChange('relatedTo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select related contact (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No related contact</SelectItem>
                {contacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName} - {contact.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="crm-gradient-bg hover:opacity-90">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TaskModal