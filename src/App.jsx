import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Statistics from './pages/Statistics'
import Report from './pages/Report'
import UserSetup from './pages/UserSetup'
import Login from './pages/Login'
import PatternAnalysis from './pages/PatternAnalysis'
import MealRecommendation from './pages/MealRecommendation'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup" element={<UserSetup />} />
          <Route path="/pattern-analysis" element={<PatternAnalysis />} />
          <Route path="/report" element={<Report />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/meal-recommendation" element={<MealRecommendation />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App