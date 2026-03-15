import React, { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie
} from 'recharts'
import {
  Users, Clock, Zap, AlertTriangle, TrendingUp, TrendingDown,
  Smartphone, Brain, Moon, Activity, Heart, BookOpen, Gamepad2,
  ChevronRight, ArrowUpRight, ArrowDownRight, Info, BarChart2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/* ─── helpers ──────────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: 'easeOut' }
})

const SEVERITY_COLORS = {
  Normal: '#16a34a',
  Moderate: '#d97706',
  'Near Severe': '#ea580c',
  'Severe Onset': '#dc2626',
  Critical: '#991b1b',
}

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon: Icon, accent, trend, trendVal, delay = 0 }) => (
  <motion.div {...fadeUp(delay)}
    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 rounded-xl" style={{ background: `${accent}15` }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
      {trendVal !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
          }`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trendVal}
        </div>
      )}
    </div>
    <p className="text-2xl font-black text-slate-800 mb-1">{value}</p>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
    <div className="pt-3 border-t border-slate-50 text-xs text-slate-400">{sub}</div>
  </motion.div>
)

/* ─── Section Header ────────────────────────────────────────────────────── */
const SectionHeader = ({ accent = '#2563eb', title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-1 h-8 rounded-full" style={{ background: accent }} />
    <div>
      <h3 className="text-lg font-black text-slate-800 leading-tight">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
    </div>
  </div>
)

/* ─── Risk Breakdown Row ────────────────────────────────────────────────── */
const RiskRow = ({ label, pct, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-600">{label}</span>
      <span style={{ color }}>{pct}%</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
      />
    </div>
  </div>
)

/* ─── Insight Pill ──────────────────────────────────────────────────────── */
const InsightPill = ({ icon: Icon, label, value, accent }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
    <div className="p-2 rounded-lg shrink-0" style={{ background: `${accent}15` }}>
      <Icon size={14} style={{ color: accent }} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-none mb-0.5">{label}</p>
      <p className="text-sm font-black text-slate-700 truncate">{value}</p>
    </div>
  </div>
)

/* ─── Custom Tooltip ────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, lang }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-xl p-4 text-sm">
      <p className="font-bold text-slate-500 text-xs mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-black" style={{ color: p.color || p.fill }}>
          {p.name}: <span>{p.value?.toFixed ? p.value.toFixed(2) : p.value}</span>
        </p>
      ))}
    </div>
  )
}

/* ─── Dashboard ─────────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { lang } = useLanguage()
  const [stats, setStats] = useState({
    total_respondents: 0, avg_usage: 0, avg_checks: 0, avg_addiction: 0
  })
  const [chartData, setChartData] = useState({ usage_chart: [], anxiety_chart: [] })

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard/stats`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setStats)
      .catch(e => console.error('Stats:', e))

    fetch(`${API_BASE_URL}/dashboard/chart-data`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setChartData)
      .catch(e => console.error('Charts:', e))
  }, [])

  // Derived / mocked breakdown data (replace with real API if available)
  const severityDist = [
    { label: lang === 'en' ? 'Normal (< 5.0)' : 'ปกติ (< 5.0)', pct: 28, color: '#16a34a' },
    { label: lang === 'en' ? 'Moderate (5.0–7.9)' : 'ปานกลาง (5.0–7.9)', pct: 35, color: '#d97706' },
    { label: lang === 'en' ? 'Near Severe (8.0–8.9)' : 'ใกล้รุนแรง (8–8.9)', pct: 20, color: '#ea580c' },
    { label: lang === 'en' ? 'Severe (9.0–9.9)' : 'รุนแรง (9–9.9)', pct: 12, color: '#dc2626' },
    { label: lang === 'en' ? 'Critical (10)' : 'วิกฤต (10)', pct: 5, color: '#991b1b' },
  ]

  const purposeData = [
    { name: lang === 'en' ? 'Social' : 'โซเชียล', value: 42, fill: '#3b82f6' },
    { name: lang === 'en' ? 'Gaming' : 'เกม', value: 18, fill: '#8b5cf6' },
    { name: lang === 'en' ? 'Study' : 'เรียน', value: 25, fill: '#10b981' },
    { name: lang === 'en' ? 'Work' : 'งาน', value: 10, fill: '#f59e0b' },
    { name: lang === 'en' ? 'Other' : 'อื่นๆ', value: 5, fill: '#94a3b8' },
  ]

  const radarData = [
    { subject: lang === 'en' ? 'Anxiety' : 'ความกังวล', A: 6.8 },
    { subject: lang === 'en' ? 'Sleep' : 'การนอน', A: 5.2 },
    { subject: lang === 'en' ? 'Social' : 'สังคม', A: 4.9 },
    { subject: lang === 'en' ? 'Academic' : 'การเรียน', A: 6.1 },
    { subject: lang === 'en' ? 'Self-Est.' : 'ความภาคภูมิ', A: 4.3 },
    { subject: lang === 'en' ? 'Family' : 'ครอบครัว', A: 5.5 },
  ]

  const emptyChart = (
    <div className="w-full h-full border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 text-xs font-bold">
      {lang === 'en' ? 'Awaiting data...' : 'รอข้อมูล...'}
    </div>
  )

  return (
    <div className="space-y-10 pb-12">

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">
            {lang === 'en' ? 'Research Dashboard' : 'แดชบอร์ดวิจัย'}
          </p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            {lang === 'en' ? 'System Overview' : 'ภาพรวมระบบ'}
          </h2>
          <p className="text-slate-400 mt-2 text-sm font-medium max-w-lg">
            {lang === 'en'
              ? 'Real-time monitoring of nomophobia severity, usage patterns, and psychological indicators across all participants.'
              : 'ติดตามระดับโนโมโฟเบีย รูปแบบการใช้งาน และตัวชี้วัดทางจิตวิทยาแบบเรียลไทม์'}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm shrink-0">
          <div className="flex -space-x-2">
            {['bg-blue-200', 'bg-indigo-200', 'bg-rose-200'].map((c, i) => (
              <div key={i} className={`w-7 h-7 rounded-full border-2 border-white ${c}`} />
            ))}
          </div>
          <div>
            <p className="text-xs font-black text-slate-700">+{stats.total_respondents}</p>
            <p className="text-[10px] text-slate-400 font-bold">{lang === 'en' ? 'Participants' : 'ผู้เข้าร่วม'}</p>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={lang === 'en' ? 'Total Cohort' : 'ประชากรทั้งหมด'}
          value={stats.total_respondents.toLocaleString()}
          sub={lang === 'en' ? 'Verified submissions' : 'ข้อมูลที่ยืนยันแล้ว'}
          icon={Users} accent="#2563eb" trend="up" trendVal="+12%" delay={0.05}
        />
        <StatCard
          label={lang === 'en' ? 'Avg Daily Usage' : 'ใช้งานเฉลี่ย/วัน'}
          value={`${stats.avg_usage}${lang === 'en' ? 'h' : ' ชม.'}`}
          sub={lang === 'en' ? 'Across all participants' : 'เฉลี่ยทุกกลุ่ม'}
          icon={Clock} accent="#7c3aed" trend="up" trendVal="+0.4h" delay={0.1}
        />
        <StatCard
          label={lang === 'en' ? 'Phone Checks/Day' : 'เช็กมือถือ/วัน'}
          value={stats.avg_checks}
          sub={lang === 'en' ? 'Average unlock count' : 'จำนวนครั้งเฉลี่ย'}
          icon={Zap} accent="#d97706" trend="up" trendVal="+8" delay={0.15}
        />
        <StatCard
          label={lang === 'en' ? 'Avg Risk Score' : 'คะแนนความเสี่ยงเฉลี่ย'}
          value={`${stats.avg_addiction}/10`}
          sub={lang === 'en' ? 'Nomophobia severity index' : 'ดัชนีความรุนแรง'}
          icon={AlertTriangle} accent="#dc2626" trend="up" trendVal="+0.3" delay={0.2}
        />
      </div>

      {/* ── Charts Row 1 ──────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Usage vs Addiction Area Chart */}
        <motion.div {...fadeUp(0.25)} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
          <SectionHeader
            accent="#2563eb"
            title={lang === 'en' ? 'Usage vs Dependency' : 'การใช้งาน vs การพึ่งพา'}
            subtitle={lang === 'en' ? 'Daily hours correlated with addiction score' : 'ชั่วโมงการใช้งานเทียบกับคะแนนการเสพติด'}
          />
          <div className="h-60">
            {chartData.usage_chart?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.usage_chart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="gUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="usage" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: '#94a3b8' }}
                    tickFormatter={v => `${v}${lang === 'en' ? 'h' : 'ชม.'}`} />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{ fill: '#94a3b8' }} domain={[0, 10]} />
                  <Tooltip content={<CustomTooltip lang={lang} />} />
                  <Area type="monotone" dataKey="addiction" name={lang === 'en' ? 'Risk Score' : 'คะแนนเสี่ยง'}
                    stroke="#2563eb" strokeWidth={3} fill="url(#gUsage)" dot={{ fill: '#2563eb', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : emptyChart}
          </div>
        </motion.div>

        {/* Anxiety Response Bar Chart */}
        <motion.div {...fadeUp(0.3)} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
          <SectionHeader
            accent="#7c3aed"
            title={lang === 'en' ? 'Anxiety Response Curve' : 'ความสัมพันธ์ความกังวลกับความเสี่ยง'}
            subtitle={lang === 'en' ? 'Anxiety level vs addiction score' : 'ระดับความกังวลเทียบกับคะแนนการเสพติด'}
          />
          <div className="h-60">
            {chartData.anxiety_chart?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.anxiety_chart} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="anxiety" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{ fill: '#94a3b8' }} domain={[0, 10]} />
                  <Tooltip content={<CustomTooltip lang={lang} />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="addiction" name={lang === 'en' ? 'Avg Risk' : 'ความเสี่ยงเฉลี่ย'} radius={[6, 6, 0, 0]} barSize={18}>
                    {chartData.anxiety_chart.map((entry, i) => (
                      <Cell key={i} fill={
                        entry.addiction > 8 ? '#dc2626' :
                          entry.addiction > 6 ? '#ea580c' :
                            entry.addiction > 4 ? '#d97706' : '#7c3aed'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : emptyChart}
          </div>
        </motion.div>
      </div>

      {/* ── Detail Row ────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Severity Distribution */}
        <motion.div {...fadeUp(0.35)} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
          <SectionHeader
            accent="#dc2626"
            title={lang === 'en' ? 'Severity Distribution' : 'การกระจายระดับความรุนแรง'}
            subtitle={lang === 'en' ? '% of participants per level' : 'สัดส่วนผู้เข้าร่วมแต่ละระดับ'}
          />
          <div className="space-y-4">
            {severityDist.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * i + 0.4 }}>
                <RiskRow label={s.label} pct={s.pct} color={s.color} />
              </motion.div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-slate-50 text-xs text-slate-400">
            {lang === 'en'
              ? `${severityDist[0].pct + severityDist[1].pct}% of participants are in manageable risk zones`
              : `${severityDist[0].pct + severityDist[1].pct}% ของผู้เข้าร่วมอยู่ในระดับที่จัดการได้`}
          </div>
        </motion.div>

        {/* Psychological Radar */}
        <motion.div {...fadeUp(0.4)} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
          <SectionHeader
            accent="#0ea5e9"
            title={lang === 'en' ? 'Psychological Profile' : 'โปรไฟล์จิตวิทยาเฉลี่ย'}
            subtitle={lang === 'en' ? 'Average scores across key factors' : 'คะแนนเฉลี่ยปัจจัยสำคัญ'}
          />
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} />
                <Radar name="avg" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2} dot={{ fill: '#0ea5e9', r: 3 }} />
                <Tooltip content={<CustomTooltip lang={lang} />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Phone Usage Purpose */}
        <motion.div {...fadeUp(0.45)} className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm">
          <SectionHeader
            accent="#10b981"
            title={lang === 'en' ? 'Usage Purpose Breakdown' : 'วัตถุประสงค์การใช้งาน'}
            subtitle={lang === 'en' ? 'Primary reason for phone use' : 'เหตุผลหลักในการใช้มือถือ'}
          />
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={purposeData} cx="50%" cy="50%" innerRadius={38} outerRadius={60}
                  dataKey="value" nameKey="name" paddingAngle={3}>
                  {purposeData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip lang={lang} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {purposeData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.fill }} />
                <span className="text-slate-500 font-medium truncate">{d.name}</span>
                <span className="ml-auto font-black text-slate-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Insight Pills ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.5)}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={14} className="text-slate-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {lang === 'en' ? 'Key Population Insights' : 'ข้อมูลเชิงลึกประชากร'}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <InsightPill icon={Moon} accent="#7c3aed" label={lang === 'en' ? 'Avg Sleep' : 'นอนเฉลี่ย'} value={lang === 'en' ? '6.2 hrs' : '6.2 ชม.'} />
          <InsightPill icon={Brain} accent="#dc2626" label={lang === 'en' ? 'Anxiety Avg' : 'ความกังวลเฉลี่ย'} value="6.8 / 10" />
          <InsightPill icon={Heart} accent="#e11d48" label={lang === 'en' ? 'Depression Avg' : 'ความเศร้าเฉลี่ย'} value="5.4 / 10" />
          <InsightPill icon={Gamepad2} accent="#8b5cf6" label={lang === 'en' ? 'Gaming Avg' : 'เล่นเกมเฉลี่ย'} value={lang === 'en' ? '1.8 hrs' : '1.8 ชม.'} />
          <InsightPill icon={BookOpen} accent="#10b981" label={lang === 'en' ? 'Study Avg' : 'เรียนเฉลี่ย'} value={lang === 'en' ? '1.2 hrs' : '1.2 ชม.'} />
          <InsightPill icon={Smartphone} accent="#f59e0b" label={lang === 'en' ? 'Apps Used' : 'แอปที่ใช้'} value={lang === 'en' ? '9 apps/day' : '9 แอป/วัน'} />
        </div>
      </motion.div>

      {/* ── Alert Banner ──────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.55)}
        className="rounded-2xl p-6 flex items-start gap-4"
        style={{ background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', border: '1px solid #fed7aa' }}
      >
        <div className="p-2 bg-orange-100 rounded-xl shrink-0">
          <AlertTriangle size={18} className="text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="font-black text-orange-800 text-sm mb-1">
            {lang === 'en' ? 'Population Alert' : 'การแจ้งเตือนประชากร'}
          </p>
          <p className="text-orange-700 text-xs leading-relaxed">
            {lang === 'en'
              ? `${severityDist[2].pct + severityDist[3].pct + severityDist[4].pct}% of participants score above 8.0 — considered clinically significant. Targeted interventions are recommended for this group.`
              : `${severityDist[2].pct + severityDist[3].pct + severityDist[4].pct}% ของผู้เข้าร่วมมีคะแนนสูงกว่า 8.0 ซึ่งถือว่ามีนัยสำคัญทางคลินิก แนะนำให้มีการแทรกแซงเฉพาะกลุ่ม`}
          </p>
        </div>
        <div className="text-orange-400 text-xs font-black shrink-0">
          {severityDist[2].pct + severityDist[3].pct + severityDist[4].pct}%
        </div>
      </motion.div>

    </div>
  )
}

export default Dashboard