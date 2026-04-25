import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import RoutePlanner from './pages/RoutePlanner'
import Alerts from './pages/Alerts'
import Admin from './pages/Admin'
import LiveMap from './pages/LiveMap'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/route" element={<RoutePlanner />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

