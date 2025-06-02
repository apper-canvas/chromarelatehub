import { useState, useEffect } from 'react'
import { Button } from '../components/ui/button'
import ApperIcon from '../components/ApperIcon'
import PipelineBoard from '../components/features/PipelineBoard'
import OpportunityModal from '../components/features/OpportunityModal'
import { opportunityService } from '../services/opportunityService'
import { contactService } from '../services/contactService'
import { toast } from 'sonner'

const Pipeline = () => {
  const [opportunities, setOpportunities] = useState([])
  const [contacts, setContacts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false)
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)

  // Fetch opportunities and contacts on component mount
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoadingOpportunities(true)
      try {
        const opportunitiesData = await opportunityService.fetchAllOpportunities()
        setOpportunities(opportunitiesData || [])
      } catch (error) {
        console.error('Error fetching opportunities:', error)
        toast.error('Failed to load opportunities')
      } finally {
        setIsLoadingOpportunities(false)
      }
    }

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

    fetchOpportunities()
    fetchContacts()
  }, [])

  const handleAddOpportunity = () => {
    setSelectedOpportunity(null)
    setIsModalOpen(true)
  }

  const handleEditOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsModalOpen(true)
  }

  const handleSaveOpportunity = async (opportunityData) => {
    try {
      if (selectedOpportunity) {
        // Update existing opportunity
        const updatedOpportunity = await opportunityService.updateOpportunity(selectedOpportunity.Id, opportunityData)
        if (updatedOpportunity) {
          setOpportunities(prevOpportunities => 
            prevOpportunities.map(opp => 
              opp.Id === selectedOpportunity.Id ? updatedOpportunity : opp
            )
          )
        }
      } else {
        // Create new opportunity
        const newOpportunity = await opportunityService.createOpportunity(opportunityData)
        if (newOpportunity) {
          setOpportunities(prevOpportunities => [newOpportunity, ...prevOpportunities])
        }
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving opportunity:', error)
    }
  }

  const handleDeleteOpportunity = async (opportunityId) => {
    try {
      const success = await opportunityService.deleteOpportunity(opportunityId)
      if (success) {
        setOpportunities(prevOpportunities => 
          prevOpportunities.filter(opp => opp.Id !== opportunityId)
        )
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error)
    }
  }

  const handleStageChange = async (opportunityId, newStage) => {
    try {
      const opportunity = opportunities.find(opp => opp.Id === opportunityId)
      if (opportunity) {
        const updatedOpportunity = await opportunityService.updateOpportunity(opportunityId, {
          ...opportunity,
          stage: newStage
        })
        if (updatedOpportunity) {
          setOpportunities(prevOpportunities => 
            prevOpportunities.map(opp => 
              opp.Id === opportunityId ? updatedOpportunity : opp
            )
          )
          toast.success(`Opportunity moved to ${newStage} stage`)
        }
      }
    } catch (error) {
      console.error('Error updating opportunity stage:', error)
    }
  }

  const totalValue = opportunities.reduce((sum, opp) => sum + (parseFloat(opp.value) || 0), 0)
  const averageDealSize = opportunities.length > 0 ? totalValue / opportunities.length : 0

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
            <ApperIcon name="DollarSign" className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-muted-foreground">Total Pipeline Value</span>
          </div>
          <p className="text-2xl font-bold mt-1">${totalValue.toLocaleString()}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Target" className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Active Opportunities</span>
          </div>
          <p className="text-2xl font-bold mt-1">{opportunities.length}</p>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-muted-foreground">Average Deal Size</span>
          </div>
          <p className="text-2xl font-bold mt-1">${averageDealSize.toLocaleString()}</p>
        </div>
      </div>

      <PipelineBoard
        opportunities={opportunities}
        onEdit={handleEditOpportunity}
        onDelete={handleDeleteOpportunity}
        onStageChange={handleStageChange}
        isLoading={isLoadingOpportunities}
      />

      <OpportunityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        opportunity={selectedOpportunity}
        contacts={contacts}
        onSave={handleSaveOpportunity}
        isLoadingContacts={isLoadingContacts}
      />
    </div>
  )
}

export default Pipeline