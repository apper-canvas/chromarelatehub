import { useCRM } from '../context/CRMContext'
import { Button } from '../components/ui/button'
import ApperIcon from '../components/ApperIcon'
import PipelineBoard from '../components/features/PipelineBoard'
import { useState } from 'react'
import OpportunityModal from '../components/features/OpportunityModal'

const Pipeline = () => {
  const { state, dispatch } = useCRM()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)

  const handleAddOpportunity = () => {
    setSelectedOpportunity(null)
    setIsModalOpen(true)
  }

  const handleEditOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsModalOpen(true)
  }

  const totalValue = state.opportunities.reduce((sum, opp) => sum + opp.value, 0)
  const averageDealSize = state.opportunities.length > 0 ? totalValue / state.opportunities.length : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Track and manage your sales opportunities through each stage.
          </p>
        </div>
        <Button onClick={handleAddOpportunity} className="crm-gradient-bg hover:opacity-90">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Opportunity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="DollarSign" className="h-5 w-5 text-crm-success" />
            <span className="text-sm font-medium text-muted-foreground">Total Pipeline Value</span>
          </div>
          <p className="text-2xl font-bold mt-1">${totalValue.toLocaleString()}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Target" className="h-5 w-5 text-crm-primary" />
            <span className="text-sm font-medium text-muted-foreground">Active Opportunities</span>
          </div>
          <p className="text-2xl font-bold mt-1">{state.opportunities.length}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-crm-warning" />
            <span className="text-sm font-medium text-muted-foreground">Average Deal Size</span>
          </div>
          <p className="text-2xl font-bold mt-1">${averageDealSize.toLocaleString()}</p>
        </div>
      </div>

      <PipelineBoard
        opportunities={state.opportunities}
        onEdit={handleEditOpportunity}
        onDelete={(id) => dispatch({ type: 'DELETE_OPPORTUNITY', payload: id })}
        onStageChange={(opportunityId, newStage) => {
          const opportunity = state.opportunities.find(opp => opp.id === opportunityId)
          if (opportunity) {
            dispatch({
              type: 'UPDATE_OPPORTUNITY',
              payload: { ...opportunity, stage: newStage }
            })
          }
        }}
      />

      <OpportunityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        opportunity={selectedOpportunity}
        contacts={state.contacts}
        onSave={(opportunity) => {
          if (selectedOpportunity) {
            dispatch({ type: 'UPDATE_OPPORTUNITY', payload: opportunity })
          } else {
            dispatch({ type: 'ADD_OPPORTUNITY', payload: opportunity })
          }
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default Pipeline