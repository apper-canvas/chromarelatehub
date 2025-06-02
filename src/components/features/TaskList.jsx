import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import ApperIcon from '../ApperIcon'
import { taskTypes, taskPriorities } from '../../constants/crmConfig'
import { format, isAfter } from 'date-fns'

const TaskList = ({ tasks, contacts, onEdit, onDelete, onToggleComplete }) => {
  const getTaskTypeIcon = (type) => {
    const taskType = taskTypes.find(t => t.value === type)
    return taskType?.icon || 'CheckSquare'
  }

  const getPriorityConfig = (priority) => {
    return taskPriorities.find(p => p.value === priority) || taskPriorities[0]
  }

  const getRelatedContact = (relatedTo) => {
    return contacts.find(c => c.id === relatedTo)
  }

  const isOverdue = (task) => {
    return !task.completed && isAfter(new Date(), new Date(task.dueDate))
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const priorityConfig = getPriorityConfig(task.priority)
        const relatedContact = getRelatedContact(task.relatedTo)
        const overdue = isOverdue(task)
        
        return (
          <Card key={task.id} className={`p-6 transition-all ${task.completed ? 'opacity-60' : ''} ${overdue ? 'border-destructive/50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleComplete(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ApperIcon name={getTaskTypeIcon(task.type)} size={16} className="text-muted-foreground" />
                    <h3 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`${priorityConfig.color} text-xs`}
                    >
                      {priorityConfig.label}
                    </Badge>
                    {overdue && (
                      <Badge variant="destructive" className="text-xs">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3 max-w-2xl">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="User" size={14} />
                      {task.assignedTo}
                    </span>
                    {relatedContact && (
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Link" size={14} />
                        {relatedContact.firstName} {relatedContact.lastName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  <ApperIcon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
      
      {tasks.length === 0 && (
        <Card className="p-12 text-center">
          <ApperIcon name="CheckSquare" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            Create your first task or adjust your search filters.
          </p>
        </Card>
      )}
    </div>
  )
}

export default TaskList