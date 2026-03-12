import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Header สำหรับ bypass ngrok browser warning
const HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total_respondents: '...',
    avg_usage: '...',
    avg_checks: '...',
    avg_addiction: '...'
  })

  const [formData, setFormData] = useState({
    age: 18,
    dailyUsage: 5,
    phoneChecks: 50,
    screenTimeBed: 1,
    anxiety: 5,
    social: 5
  })
  const [prediction, setPrediction] = useState(null)
  
  const [chartData, setChartData] = useState({
    usage_chart: [],
    anxiety_chart: []
  })

  // Fetch stats from backend on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err))

    fetch(`${API_BASE_URL}/chart-data`, { headers: HEADERS })
      .then(res => res.json())
      .then(data => setChartData(data))
      .catch(err => console.error("Error fetching chart data:", err))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      setPrediction(data.prediction_score)
    } catch (err) {
      console.error("Prediction error:", err)
      alert("Error connecting to backend API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation / Branding */}
      <header className="bg-[#003366] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📱</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NOMOPHOBIA ANALYSIS</h1>
              <p className="text-xs text-slate-300 uppercase tracking-widest">Official Research Portal</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-1 border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-300 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`pb-1 border-b-2 transition-colors ${activeTab === 'analysis' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-300 hover:text-white'}`}
            >
              Assessment Tool
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-10">

        {activeTab === 'dashboard' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Analytical Insights</h2>
                <p className="text-slate-500 mt-1">Real-time smartphone usage metrics and behavioral statistics from our database.</p>
              </div>
              <div className="text-sm font-semibold text-[#003366] bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                Data Refresh: {new Date().toLocaleDateString('th-TH')}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Respondents', value: stats.total_respondents, sub: 'Participants', color: 'text-blue-600' },
                { label: 'Avg. Daily Usage', value: `${stats.avg_usage}h`, sub: 'Per day', color: 'text-sky-600' },
                { label: 'Phone Checks', value: stats.avg_checks, sub: 'Times/Day', color: 'text-indigo-600' },
                { label: 'Addiction Level', value: `${stats.avg_addiction}/10`, sub: 'Avg. Score', color: 'text-rose-600' },
              ].map((stat, i) => (
                <div key={i} className="card-official p-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card-official p-8 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center shrink-0">
                  <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                  Usage Duration vs. Addiction Level
                </h3>
                <div className="h-64 bg-white rounded-lg flex items-center justify-center p-2 grow relative">
                  {chartData.usage_chart && chartData.usage_chart.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.usage_chart}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="usage" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}h`} />
                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                        <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="addiction" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-slate-400 text-sm h-full w-full flex items-center justify-center border border-dashed border-slate-300 rounded-lg">
                      Loading Chart Data...
                    </div>
                  )}
                </div>
              </div>
              <div className="card-official p-8 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center shrink-0">
                  <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
                  Anxiety Factor Correlation
                </h3>
                <div className="h-64 bg-white rounded-lg flex items-center justify-center p-2 grow relative">
                  {chartData.anxiety_chart && chartData.anxiety_chart.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.anxiety_chart}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="anxiety" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="addiction" stroke="#4F46E5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-slate-400 text-sm h-full w-full flex items-center justify-center border border-dashed border-slate-300 rounded-lg">
                      Loading Chart Data...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800">Nomophobia Assessment</h2>
              <p className="text-slate-500 mt-2">Validated psychological screening tool for smartphone dependency.</p>
            </div>

            <div className="card-official overflow-hidden">
              <div className="h-2 bg-blue-600 w-full" />
              <div className="p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Age Range</label>
                      <input
                        type="number" name="age" value={formData.age} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Daily Phone Usage (Hours)</label>
                      <input
                        type="number" step="0.5" name="dailyUsage" value={formData.dailyUsage} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700">Anxiety when separated from mobile</label>
                        <span className="text-blue-600 font-bold">{formData.anxiety}/10</span>
                      </div>
                      <input
                        type="range" min="1" max="10" name="anxiety" value={formData.anxiety} onChange={handleInputChange}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700">Frequency of device checking</label>
                        <span className="text-blue-600 font-bold">{formData.phoneChecks} Checks</span>
                      </div>
                      <input
                        type="range" min="0" max="200" name="phoneChecks" value={formData.phoneChecks} onChange={handleInputChange}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700">Screen Time Before Bed (Hours)</label>
                        <span className="text-blue-600 font-bold">{formData.screenTimeBed} Hours</span>
                      </div>
                      <input
                        type="range" min="0" max="12" step="0.5" name="screenTimeBed" value={formData.screenTimeBed} onChange={handleInputChange}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700">Social Interactions Level</label>
                        <span className="text-blue-600 font-bold">{formData.social}/10</span>
                      </div>
                      <input
                        type="range" min="1" max="10" name="social" value={formData.social} onChange={handleInputChange}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className={`w-full btn-official py-4 text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {loading ? 'Processing Data...' : 'Generate Diagnostic Report 🔍'}
                  </button>
                </form>

                {prediction && (
                  <div className="mt-10 p-8 rounded-xl bg-slate-50 border border-slate-200 animate-in zoom-in duration-300">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-4 border-slate-200">Analysis Results (Live Prediction)</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-600 font-medium">Addiction Severity Score</span>
                      <span className={`text-3xl font-black ${prediction > 7 ? 'text-rose-600' : prediction > 4 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {prediction} / 10
                      </span>
                    </div>

                    <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-6">
                      <div
                        className={`h-full transition-all duration-1000 ${prediction > 7 ? 'bg-rose-600' : prediction > 4 ? 'bg-amber-600' : 'bg-emerald-600'}`}
                        style={{ width: `${prediction * 10}%` }}
                      />
                    </div>

                    <div className={`p-4 rounded-lg flex items-start space-x-3 ${prediction > 7 ? 'bg-rose-50 text-rose-800' : prediction > 4 ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'}`}>
                      <span className="text-xl">ℹ️</span>
                      <p className="text-sm leading-relaxed">
                        {prediction > 7 ? 'High Risk detected. Results suggest significant psychological dependency based on our Machine Learning model.' :
                          prediction > 4 ? 'Moderate Risk identified. Patterns indicate emerging addiction habits. Consider setting screen time limits.' :
                            'Low Risk. Smartphone usage patterns are within healthy clinical ranges.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-xs">
        <p>© {new Date().getFullYear()} Digital Health Research Group. All Rights Reserved.</p>
        <p className="mt-2 uppercase tracking-widest">Powered by Advanced Machine Learning Intelligence</p>
      </footer>
    </div>
  )
}

export default App
