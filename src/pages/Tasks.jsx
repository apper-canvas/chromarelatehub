import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import ApperIcon from '../components/ApperIcon'
import TaskList from '../components/features/TaskList'
import TaskModal from '../components/features/TaskModal'
import FilterDropdown from '../components/common/FilterDropdown'
import { taskPriorities } from '../constants/crmConfig'
import { taskService } from '../services/taskService'
import { contactService } from '../services/contactService'
import { toast } from 'sonner'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [contacts, setContacts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)

  // Fetch tasks and contacts on component mount and when filters change
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoadingTasks(true)
      try {
        const filters = {
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
          completed: statusFilter === 'completed' ? true : statusFilter === 'pending' ? false : undefined,
          search: searchTerm || undefined
        }
        const tasksData = await taskService.fetchAllTasks(filters)
        setTasks(tasksData || [])
      } catch (error) {
        console.error('Error fetching tasks:', error)
        toast.error('Failed to load tasks')
      } finally {
        setIsLoadingTasks(false)
      }
    }

    fetchTasks()
  }, [priorityFilter, statusFilter, searchTerm])

  // Fetch contacts for the task modal
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoadingContacts(true)
      try {
        const contactsData = await contactService.fetchAllContacts()
        setContacts(contactsData || [])
      } catch (error) {
        console.error('Error fetching contacts:', error)
        toast.error('Failed to load contacts')
      } finally {
        setIsLoadingContacts(false)
      }
    }

    fetchContacts()
  }, [])

  const handleAddTask = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        // Update existing task
        const updatedTask = await taskService.updateTask(selectedTask.Id, taskData)
        if (updatedTask) {
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.Id === selectedTask.Id ? updatedTask : task
            )
          )
        }
      } else {
        // Create new task
        const newTask = await taskService.createTask(taskData)
        if (newTask) {
          setTasks(prevTasks => [newTask, ...prevTasks])
        }
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      const success = await taskService.deleteTask(taskId)
      if (success) {
        setTasks(prevTasks => 
          prevTasks.filter(task => task.Id !== taskId)
        )
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      if (task) {
        const updatedTask = await taskService.updateTask(taskId, {
          ...task,
          completed: !task.completed
        })
        if (updatedTask) {
          setTasks(prevTasks => 
            prevTasks.map(t => 
              t.Id === taskId ? updatedTask : t
            )
          )
          toast.success(`Task marked as ${updatedTask.completed ? 'completed' : 'pending'}`)
        }
      }
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = tasks.filter(task => !task.completed).length
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.due_date && new Date(task.due_date) < new Date()
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
            <ApperIcon name="Clock" className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-muted-foreground">Pending Tasks</span>
          </div>
          <p className="text-2xl font-bold mt-1">{pendingTasks}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Completed Tasks</span>
          </div>
          <p className="text-2xl font-bold mt-1">{completedTasks}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-red-500" />
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
        tasks={tasks}
        contacts={contacts}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        isLoading={isLoadingTasks}
      />

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={selectedTask}
        contacts={contacts}
        onSave={handleSaveTask}
        isLoadingContacts={isLoadingContacts}
      />
    </div>
  )
}

export default Tasks