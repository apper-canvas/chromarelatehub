import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import ApperIcon from '../components/ApperIcon'
import DashboardMetrics from '../components/features/DashboardMetrics'
import RecentActivities from '../components/features/RecentActivities'
import PipelineChart from '../components/features/PipelineChart'
import { contactService } from '../services/contactService'
import { opportunityService } from '../services/opportunityService'
import { taskService } from '../services/taskService'
import { activityService } from '../services/activityService'
import { toast } from 'sonner'

const Dashboard = () => {
  const [contacts, setContacts] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)

  // Fetch all data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch contacts
        setIsLoadingContacts(true)
        const contactsData = await contactService.fetchAllContacts()
        setContacts(contactsData || [])
        setIsLoadingContacts(false)

        // Fetch opportunities
        setIsLoadingOpportunities(true)
        const opportunitiesData = await opportunityService.fetchAllOpportunities()
        setOpportunities(opportunitiesData || [])
        setIsLoadingOpportunities(false)

        // Fetch tasks
        setIsLoadingTasks(true)
        const tasksData = await taskService.fetchAllTasks()
        setTasks(tasksData || [])
        setIsLoadingTasks(false)

        // Fetch activities
        setIsLoadingActivities(true)
        const activitiesData = await activityService.fetchAllActivities()
        setActivities(activitiesData || [])
        setIsLoadingActivities(false)

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      }
    }

    fetchDashboardData()
  }, [])

  const metrics = {
    totalContacts: contacts?.length || 0,
    activeOpportunities: opportunities?.filter(opp => opp.stage !== 'closed-won' && opp.stage !== 'closed-lost')?.length || 0,
    pendingTasks: tasks?.filter(task => !task.completed)?.length || 0,
    totalValue: opportunities?.reduce((sum, opp) => sum + (parseFloat(opp.value) || 0), 0) || 0
  }

  const isLoading = isLoadingContacts || isLoadingOpportunities || isLoadingTasks || isLoadingActivities

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your CRM today.
          </p>
        </div>
      </div>

      <DashboardMetrics metrics={metrics} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PipelineChart opportunities={opportunities} isLoading={isLoadingOpportunities} />
        <RecentActivities activities={activities?.slice(0, 5) || []} isLoading={isLoadingActivities} />
      </div>
    </div>
  )
}

export default Dashboard