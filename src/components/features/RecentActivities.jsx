import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import ApperIcon from '../ApperIcon'
import { formatDistanceToNow } from 'date-fns'

const RecentActivities = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      email: 'Mail',
      call: 'Phone',
      meeting: 'Calendar',
      note: 'FileText'
    }
    return icons[type] || 'Activity'
  }

  const getActivityColor = (type) => {
    const colors = {
      email: 'text-blue-500',
      call: 'text-green-500',
      meeting: 'text-purple-500',
      note: 'text-orange-500'
    }
    return colors[type] || 'text-gray-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="Activity" className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <ApperIcon name={getActivityIcon(activity.type)} size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    by {activity.userId}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ApperIcon name="Activity" className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activities</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivities