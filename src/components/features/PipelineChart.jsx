import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { opportunityStages } from '../../constants/crmConfig'

const PipelineChart = ({ opportunities }) => {
  const stageData = opportunityStages.map(stage => {
    const stageOpportunities = opportunities.filter(opp => opp.stage === stage.value)
    return {
      name: stage.label,
      value: stageOpportunities.length,
      totalValue: stageOpportunities.reduce((sum, opp) => sum + opp.value, 0),
      color: `hsl(var(--crm-${stage.color.replace('crm-', '')}))`
    }
  }).filter(stage => stage.value > 0)

  const COLORS = stageData.map(stage => stage.color)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {stageData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  value,
                  `${props.payload.name} (${value} deals, $${props.payload.totalValue.toLocaleString()})`
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-300 text-muted-foreground">
            <p>No pipeline data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PipelineChart