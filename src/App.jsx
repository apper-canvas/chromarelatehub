import { Routes, Route } from 'react-router-dom'
import { AppProviders } from './context/AppProviders'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Pipeline from './pages/Pipeline'
import Tasks from './pages/Tasks'

function App() {
  return (
    <AppProviders>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </Layout>
    </AppProviders>
  )
}

export default App