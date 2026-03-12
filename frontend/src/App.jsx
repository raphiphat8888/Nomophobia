import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Components
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import MobileNav from './components/MobileNav'

// Pages
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import Education from './pages/Education'
import Community from './pages/Community'

import { LanguageProvider } from './context/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex h-screen bg-[#f8fafc] text-slate-800">
          {/* Sidebar Navigation (Desktop) */}
          <Sidebar />

          {/* Mobile Bottom Navigation */}
          <MobileNav />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {/* Top Bar / Search */}
            <Header />

            {/* Page Rendering Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 relative pb-24 lg:pb-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/assessment" element={<Assessment />} />
                <Route path="/education" element={<Education />} />
                <Route path="/community" element={<Community />} />
                {/* Redirect any unknown routes to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Background Decorative Blurs */}
              <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="fixed -top-24 -left-24 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
            </div>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
