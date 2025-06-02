import { useCRM } from '../context/CRMContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import ApperIcon from '../components/ApperIcon'
import DashboardMetrics from '../components/features/DashboardMetrics'
import RecentActivities from '../components/features/RecentActivities'
import PipelineChart from '../components/features/PipelineChart'

const Dashboard = () => {
  const { state } = useCRM()

  const metrics = {
    totalContacts: state.contacts.length,
    activeOpportunities: state.opportunities.filter(opp => opp.status === 'active').length,
    pendingTasks: state.tasks.filter(task => !task.completed).length,
    totalValue: state.opportunities.reduce((sum, opp) => sum + opp.value, 0)
  }

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

      <DashboardMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PipelineChart opportunities={state.opportunities} />
        <RecentActivities activities={state.activities.slice(0, 5)} />
      </div>
    </div>
  )
}

export default Dashboard