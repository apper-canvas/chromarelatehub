import { CRMProvider } from './CRMContext'

export const AppProviders = ({ children }) => {
  return (
    <CRMProvider>
      {children}
    </CRMProvider>
  )
}