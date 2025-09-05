import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Statistics from './pages/Statistics'
import Report from './pages/Report'
import UserSetup from './pages/UserSetup'
import Login from './pages/Login'
import PatternAnalysis from './pages/PatternAnalysis'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup" element={<UserSetup />} />
          <Route path="/pattern-analysis" element={<PatternAnalysis />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App