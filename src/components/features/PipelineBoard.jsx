import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import ApperIcon from '../ApperIcon'
import { opportunityStages } from '../../constants/crmConfig'
import { format } from 'date-fns'

const PipelineBoard = ({ opportunities, onEdit, onDelete, onStageChange }) => {
  const getStageOpportunities = (stage) => {
    return opportunities.filter(opp => opp.stage === stage)
  }

  const getStageValue = (stage) => {
    return getStageOpportunities(stage).reduce((sum, opp) => sum + opp.value, 0)
  }

  const handleDragStart = (e, opportunity) => {
    e.dataTransfer.setData('text/plain', opportunity.id)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, newStage) => {
    e.preventDefault()
    const opportunityId = e.dataTransfer.getData('text/plain')
    onStageChange(opportunityId, newStage)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 overflow-x-auto">
      {opportunityStages.map((stage) => {
        const stageOpportunities = getStageOpportunities(stage.value)
        const stageValue = getStageValue(stage.value)

        return (
          <div key={stage.value} className="min-w-[300px]">
            <Card className="h-full">
              <CardHeader className={`pipeline-stage-${stage.value} text-white rounded-t-lg`}>
                <CardTitle className="text-sm font-medium">
                  {stage.label}
                </CardTitle>
                <div className="text-xs opacity-90">
                  {stageOpportunities.length} deals • ${stageValue.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent
                className="p-4 min-h-[400px] space-y-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.value)}
              >
                {stageOpportunities.map((opportunity) => (
                  <Card
                    key={opportunity.id}
                    className="p-4 cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, opportunity)}
                  >
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          ${opportunity.value.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {opportunity.probability}% chance
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(opportunity.expectedCloseDate), 'MMM dd')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {opportunity.assignedTo}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => onEdit(opportunity)}
                          >
                            <ApperIcon name="Edit" size={12} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => onDelete(opportunity.id)}
                          >
                            <ApperIcon name="Trash2" size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {stageOpportunities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ApperIcon name="Target" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No opportunities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

export default PipelineBoard