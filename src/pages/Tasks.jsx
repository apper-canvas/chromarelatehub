import { useState } from 'react'
import { useCRM } from '../context/CRMContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import ApperIcon from '../components/ApperIcon'
import TaskList from '../components/features/TaskList'
import TaskModal from '../components/features/TaskModal'
import FilterDropdown from '../components/common/FilterDropdown'
import { taskPriorities } from '../constants/crmConfig'

const Tasks = () => {
  const { state, dispatch } = useCRM()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTasks = state.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completed' && task.completed) ||
                         (statusFilter === 'pending' && !task.completed)
    
    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleAddTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const completedTasks = state.tasks.filter(task => task.completed).length
  const pendingTasks = state.tasks.filter(task => !task.completed).length
  const overdueTasks = state.tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your to-dos and stay on top of important activities.
          </p>
        </div>
        <Button onClick={handleAddTask} className="crm-gradient-bg hover:opacity-90">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" className="h-5 w-5 text-crm-warning" />
            <span className="text-sm font-medium text-muted-foreground">Pending Tasks</span>
          </div>
          <p className="text-2xl font-bold mt-1">{pendingTasks}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="CheckCircle" className="h-5 w-5 text-crm-success" />
            <span className="text-sm font-medium text-muted-foreground">Completed Tasks</span>
          </div>
          <p className="text-2xl font-bold mt-1">{completedTasks}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-crm-danger" />
            <span className="text-sm font-medium text-muted-foreground">Overdue Tasks</span>
          </div>
          <p className="text-2xl font-bold mt-1">{overdueTasks}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            size={16} 
          />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <FilterDropdown
          options={[
            { value: 'all', label: 'All Priorities' },
            ...taskPriorities
          ]}
          value={priorityFilter}
          onChange={setPriorityFilter}
          placeholder="Filter by priority"
        />
        
        <FilterDropdown
          options={[
            { value: 'all', label: 'All Tasks' },
            { value: 'pending', label: 'Pending' },
            { value: 'completed', label: 'Completed' }
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Filter by status"
        />
      </div>

      <TaskList
        tasks={filteredTasks}
        contacts={state.contacts}
        onEdit={handleEditTask}
        onDelete={(id) => dispatch({ type: 'DELETE_TASK', payload: id })}
        onToggleComplete={(id) => {
          const task = state.tasks.find(t => t.id === id)
          if (task) {
            dispatch({
              type: 'UPDATE_TASK',
              payload: { ...task, completed: !task.completed }
            })
          }
        }}
      />

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={selectedTask}
        contacts={state.contacts}
        onSave={(task) => {
          if (selectedTask) {
            dispatch({ type: 'UPDATE_TASK', payload: task })
          } else {
            dispatch({ type: 'ADD_TASK', payload: task })
          }
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default Tasks