import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="flex h-screen bg-[#f8fafc] text-slate-800">
          {/* Sidebar Navigation */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {/* Top Bar / Search */}
            <Header />

            {/* Page Rendering Area */}
            <div className="flex-1 overflow-y-auto p-8 relative">
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
