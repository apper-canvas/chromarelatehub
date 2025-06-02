import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import ApperIcon from '../ApperIcon'

const DashboardMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total Contacts',
      value: metrics.totalContacts,
      icon: 'Users',
      color: 'text-crm-primary',
      bgColor: 'bg-crm-primary/10'
    },
    {
      title: 'Active Opportunities',
      value: metrics.activeOpportunities,
      icon: 'Target',
      color: 'text-crm-secondary',
      bgColor: 'bg-crm-secondary/10'
    },
    {
      title: 'Pending Tasks',
      value: metrics.pendingTasks,
      icon: 'Clock',
      color: 'text-crm-warning',
      bgColor: 'bg-crm-warning/10'
    },
    {
      title: 'Pipeline Value',
      value: `$${metrics.totalValue.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-crm-success',
      bgColor: 'bg-crm-success/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric) => (
        <Card key={metric.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`h-8 w-8 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
              <ApperIcon name={metric.icon} className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DashboardMetrics