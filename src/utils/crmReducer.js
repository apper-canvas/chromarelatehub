import { mockContacts, mockOpportunities, mockTasks, mockActivities } from '../constants/mockData'

export const initialState = {
  contacts: mockContacts,
  opportunities: mockOpportunities,
  tasks: mockTasks,
  activities: mockActivities,
  filters: {
    contactStatus: 'all',
    opportunityStage: 'all',
    taskStatus: 'all'
  }
}

export const crmReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CONTACT':
      return {
        ...state,
        contacts: [...state.contacts, action.payload]
      }
    
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        )
      }
    
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload)
      }
    
    case 'ADD_OPPORTUNITY':
      return {
        ...state,
        opportunities: [...state.opportunities, action.payload]
      }
    
    case 'UPDATE_OPPORTUNITY':
      return {
        ...state,
        opportunities: state.opportunities.map(opportunity =>
          opportunity.id === action.payload.id ? action.payload : opportunity
        )
      }
    
    case 'DELETE_OPPORTUNITY':
      return {
        ...state,
        opportunities: state.opportunities.filter(opportunity => opportunity.id !== action.payload)
      }
    
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      }
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      }
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    
    case 'ADD_ACTIVITY':
      return {
        ...state,
        activities: [...state.activities, action.payload]
      }
    
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.type]: action.payload.value
        }
      }
    
    default:
      return state
  }
}