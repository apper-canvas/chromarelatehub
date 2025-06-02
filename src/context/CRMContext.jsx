import { createContext, useContext, useReducer } from 'react'
import { crmReducer, initialState } from '../utils/crmReducer'

const CRMContext = createContext()

export const CRMProvider = ({ children }) => {
  const [state, dispatch] = useReducer(crmReducer, initialState)

  return (
    <CRMContext.Provider value={{ state, dispatch }}>
      {children}
    </CRMContext.Provider>
  )
}

export const useCRM = () => {
  const context = useContext(CRMContext)
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider')
  }
  return context
}