import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell
} from 'recharts'
import { 
  Users, 
  Clock, 
  Zap, 
  AlertTriangle,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const API_BASE_URL = 'http://127.0.0.1:8000'

const StatCard = ({ label, value, sub, icon: Icon, colorClass, bgColorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 flex flex-col justify-between"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black mt-2 text-slate-800">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${bgColorClass}`}>
        <Icon className={colorClass} size={24} />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-500">
      <TrendingUp size={14} className="mr-1 text-emerald-500" />
      <span>{sub}</span>
    </div>
  </motion.div>
)

const Dashboard = () => {
  const { lang } = useLanguage()
  const [stats, setStats] = useState({
    total_respondents: 0,
    avg_usage: 0,
    avg_checks: 0,
    avg_addiction: 0
  })
  const [chartData, setChartData] = useState({ usage_chart: [], anxiety_chart: [] })

  useEffect(() => {
    fetch(`${API_BASE_URL}/stats`).then(res => res.json()).then(setStats)
    fetch(`${API_BASE_URL}/chart-data`).then(res => res.json()).then(setChartData)
  }, [])

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? 'System Overview' : 'ภาพรวมระบบ'}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            {lang === 'en' ? 'Monitoring digital health metrics across the research network.' : 'ติดตามตัวชี้วัดสุขภาพดิจิทัลผ่านเครือข่ายการวิจัย'}
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100" />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100" />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
          </div>
          <span className="text-xs font-bold text-slate-600">
             +{stats.total_respondents} {lang === 'en' ? 'Live Participants' : 'ผู้เข้าร่วมตัวจริง'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label={lang === 'en' ? "Total Cohort" : "ประชากรทั้งหมด"} 
          value={stats.total_respondents} 
          sub={lang === 'en' ? "Verified entries" : "ข้อมูลที่ตรวจสอบแล้ว"} 
          icon={Users} 
          colorClass="text-blue-600"
          bgColorClass="bg-blue-600/10"
        />
        <StatCard 
          label={lang === 'en' ? "Usage Intensity" : "ความเข้มข้นการใช้"} 
          value={`${stats.avg_usage}${lang === 'en' ? 'h' : ' ชม.'}`} 
          sub={lang === 'en' ? "Daily average" : "เฉลี่ยต่อวัน"} 
          icon={Clock} 
          colorClass="text-indigo-600"
          bgColorClass="bg-indigo-600/10"
        />
        <StatCard 
          label={lang === 'en' ? "Device Checks" : "การเช็คอุปกรณ์"} 
          value={stats.avg_checks} 
          sub={lang === 'en' ? "Actions per day" : "ครั้งต่อวัน"} 
          icon={Zap} 
          colorClass="text-amber-600"
          bgColorClass="bg-amber-600/10"
        />
        <StatCard 
          label={lang === 'en' ? "Risk Index" : "ดัชนีความเสี่ยง"} 
          value={`${stats.avg_addiction}/10`} 
          sub={lang === 'en' ? "Clinical severity" : "ความรุนแรงทางคลินิก"} 
          icon={AlertTriangle} 
          colorClass="text-rose-600"
          bgColorClass="bg-rose-600/10"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <div className="w-2 h-8 bg-blue-600 rounded-full mr-4" />
              {lang === 'en' ? 'Usage vs Dependency Correlation' : 'ความสัมพันธ์การใช้งานกับการเสพติด'}
            </h3>
            <button className="text-blue-600 text-xs font-bold hover:underline">
              {lang === 'en' ? 'Full Report' : 'รายงานฉบับเต็ม'}
            </button>
          </div>
          <div className="h-72 w-full grow">
            {chartData.usage_chart?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.usage_chart}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="usage" axisLine={false} tickLine={false} fontSize={12} tickFormatter={v => `${v}${lang === 'en' ? 'h' : 'ชม.'}`} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="addiction" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 text-xs font-medium">
                {lang === 'en' ? 'Synchronizing Data...' : 'กำลังซิงโครไนซ์ข้อมูล...'}
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center">
              <div className="w-2 h-8 bg-indigo-600 rounded-full mr-4" />
              {lang === 'en' ? 'Anxiety Response Curve' : 'กราฟการตอบสนองความกังวล'}
            </h3>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>{lang === 'en' ? 'LIVE FEED' : 'ข้อมูลสด'}</span>
            </div>
          </div>
          <div className="h-72 w-full grow">
            {chartData.anxiety_chart?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.anxiety_chart}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="anxiety" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} domain={[0, 10]} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  <Bar dataKey="addiction" radius={[6, 6, 0, 0]} barSize={20}>
                    {chartData.anxiety_chart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.addiction > 7 ? '#e11d48' : '#4f46e5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 text-xs font-medium">
                {lang === 'en' ? 'Synchronizing Data...' : 'กำลังซิงโครไนซ์ข้อมูล...'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
