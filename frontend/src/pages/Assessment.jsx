import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import {
  Zap, PhoneOff, ShieldCheck, User, Clock, MousePointer2, Moon, Brain,
  ChevronRight, Sparkles, Gamepad2, BookOpen, Activity, Heart, Users, Lock,
  Smartphone, CheckCircle, AlertTriangle, AlertCircle, HeartPulse,
  TrendingUp, TrendingDown, RotateCcw, ArrowRight, Star, Shield
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const getSeverityConfig = (score) => {
  if (score < 5.0) return {
    label_en: 'Normal', label_th: 'ปกติ',
    accent: '#16a34a', bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
    textColor: '#14532d', icon: CheckCircle,
    tag_en: 'SAFE', tag_th: 'ปลอดภัย',
    pct: Math.round((score / 10) * 100),
    summary_en: 'Your relationship with your phone is healthy. You have great self-control and use technology purposefully.',
    summary_th: 'คุณมีความสัมพันธ์ที่ดีกับมือถือ ควบคุมตัวเองได้ดีและใช้เทคโนโลยีอย่างมีจุดมุ่งหมาย',
    tips_en: [
      'Keep your current healthy routines',
      'Share your digital habits with others as inspiration',
      'Review your usage quarterly to stay on track',
    ],
    tips_th: [
      'รักษานิสัยที่ดีในปัจจุบันต่อไป',
      'เป็นแรงบันดาลใจให้คนรอบข้างในการใช้เทคโนโลยีอย่างสมดุล',
      'ตรวจสอบพฤติกรรมการใช้งานทุกไตรมาส',
    ],
    risks_en: [], risks_th: [],
  }
  if (score < 8.0) return {
    label_en: 'Moderate', label_th: 'ปานกลาง',
    accent: '#d97706', bg: 'linear-gradient(135deg,#fffbeb,#fef3c7)',
    textColor: '#78350f', icon: Activity,
    tag_en: 'CAUTION', tag_th: 'ระวัง',
    pct: Math.round((score / 10) * 100),
    summary_en: 'You are beginning to rely on your phone more than needed. Early habits are forming that may escalate without attention.',
    summary_th: 'คุณเริ่มพึ่งพามือถือมากกว่าที่จำเป็น พฤติกรรมในช่วงนี้อาจลุกลามถ้าไม่ได้รับการดูแล',
    tips_en: [
      'Set a daily screen time limit using your phone\'s built-in tools',
      'Try one phone-free hour per day — start with mealtimes',
      'Disable notifications from 3–5 non-essential apps',
    ],
    tips_th: [
      'ตั้งเวลาจำกัดหน้าจอรายวันผ่านการตั้งค่าของมือถือ',
      'ลองไม่ใช้มือถือ 1 ชั่วโมงต่อวัน — เริ่มจากเวลาอาหาร',
      'ปิดการแจ้งเตือนจากแอปที่ไม่จำเป็น 3–5 แอป',
    ],
    risks_en: ['Difficulty focusing without phone nearby', 'Mild anxiety when battery is low'],
    risks_th: ['มีสมาธิได้ยากเมื่อมือถือไม่อยู่ใกล้มือ', 'วิตกกังวลเล็กน้อยเมื่อแบตเตอรี่ใกล้หมด'],
  }
  if (score < 9.0) return {
    label_en: 'Near Severe', label_th: 'ใกล้รุนแรง',
    accent: '#ea580c', bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
    textColor: '#7c2d12', icon: AlertTriangle,
    tag_en: 'WARNING', tag_th: 'เตือน',
    pct: Math.round((score / 10) * 100),
    summary_en: 'Your phone use is significantly disrupting daily life. A structured digital detox is strongly recommended before this escalates further.',
    summary_th: 'การใช้มือถือของคุณส่งผลกระทบชัดเจนต่อชีวิตประจำวัน ควรเริ่มดีท็อกซ์ดิจิทัลอย่างจริงจังก่อนที่สถานการณ์จะรุนแรงขึ้น',
    tips_en: [
      'Start a 7-day digital detox — reduce usage by 30 min/day',
      'Keep your phone in another room while sleeping',
      'Replace phone time with a physical activity or hobby',
      'Track your screen time weekly and reward yourself for reducing it',
    ],
    tips_th: [
      'เริ่มดีท็อกซ์ดิจิทัล 7 วัน — ลดเวลาใช้งาน 30 นาที/วัน',
      'วางมือถือในห้องอื่นขณะนอนหลับ',
      'ใช้เวลาที่เคยอยู่กับมือถือไปออกกำลังกายหรือทำงานอดิเรก',
      'ติดตามเวลาหน้าจอรายสัปดาห์และให้รางวัลตัวเองเมื่อลดลงได้',
    ],
    risks_en: [
      'Sleep disruption from late-night usage',
      'Declining attention span and concentration',
      'Social withdrawal from in-person interactions',
    ],
    risks_th: [
      'การนอนหลับถูกรบกวนจากการใช้มือถือดึก',
      'สมาธิและความสามารถในการโฟกัสลดลง',
      'ถอยห่างจากการมีปฏิสัมพันธ์กับคนจริงๆ',
    ],
  }
  if (score < 10) return {
    label_en: 'Severe Onset', label_th: 'เริ่มรุนแรง',
    accent: '#dc2626', bg: 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
    textColor: '#7f1d1d', icon: AlertCircle,
    tag_en: 'DANGER', tag_th: 'อันตราย',
    pct: Math.round((score / 10) * 100),
    summary_en: 'This level of phone dependency is seriously affecting your mental health, productivity, and relationships. Immediate lifestyle changes are required.',
    summary_th: 'ระดับการพึ่งพามือถือนี้ส่งผลกระทบร้ายแรงต่อสุขภาพจิต ประสิทธิภาพ และความสัมพันธ์ ต้องปรับพฤติกรรมอย่างเร่งด่วน',
    tips_en: [
      'Speak with a counselor or mental health professional',
      'Set hard limits — use app blockers during focus/sleep hours',
      'Commit to at least 2 phone-free hours per day',
      'Rebuild real-world social connections intentionally',
    ],
    tips_th: [
      'ปรึกษานักจิตวิทยาหรือผู้เชี่ยวชาญด้านสุขภาพจิต',
      'ตั้งขีดจำกัดที่เข้มงวด — ใช้แอปบล็อกในช่วงโฟกัสและนอนหลับ',
      'ตั้งใจไม่ใช้มือถืออย่างน้อย 2 ชั่วโมงต่อวัน',
      'สร้างความสัมพันธ์ในโลกจริงอย่างตั้งใจ',
    ],
    risks_en: [
      'Significant anxiety and panic when phone is unavailable',
      'Chronic sleep deprivation',
      'Deteriorating academic or work performance',
      'Isolation from family and friends',
    ],
    risks_th: [
      'วิตกกังวลและตื่นตระหนกรุนแรงเมื่อไม่มีมือถือ',
      'อดนอนเรื้อรัง',
      'ผลการเรียนหรือการทำงานตกต่ำ',
      'แยกตัวออกจากครอบครัวและเพื่อน',
    ],
  }
  return {
    label_en: 'Critical', label_th: 'วิกฤต',
    accent: '#b91c1c', bg: 'linear-gradient(135deg,#fef2f2,#fee2e2)',
    textColor: '#450a0a', icon: HeartPulse,
    tag_en: 'CRITICAL', tag_th: 'วิกฤต',
    pct: 100,
    summary_en: 'Your nomophobia has reached a critical stage. This is significantly impacting your mental health and daily functioning. Professional help is essential.',
    summary_th: 'โนโมโฟเบียของคุณถึงขั้นวิกฤต ส่งผลกระทบรุนแรงต่อสุขภาพจิตและการดำเนินชีวิต การขอความช่วยเหลือจากผู้เชี่ยวชาญเป็นสิ่งจำเป็น',
    tips_en: [
      'Seek professional mental health support immediately',
      'Consider a supervised digital detox program',
      'Involve trusted family members in your recovery',
      'Remove social media apps temporarily from your phone',
    ],
    tips_th: [
      'ขอความช่วยเหลือจากผู้เชี่ยวชาญด้านสุขภาพจิตทันที',
      'พิจารณาเข้าร่วมโปรแกรมดีท็อกซ์ดิจิทัลที่มีการดูแล',
      'ให้สมาชิกในครอบครัวที่ไว้ใจได้เข้ามามีส่วนร่วมในการฟื้นฟู',
      'ลบแอปโซเชียลมีเดียออกจากมือถือชั่วคราว',
    ],
    risks_en: [
      'Severe psychological dependence on your phone',
      'Potential clinical anxiety and depression',
      'Dysfunctional social and family relationships',
      'Inability to focus or be productive without phone access',
    ],
    risks_th: [
      'ติดมือถือในระดับจิตวิทยาอย่างรุนแรง',
      'อาจมีภาวะวิตกกังวลและซึมเศร้าในระดับคลินิก',
      'ความสัมพันธ์ทางสังคมและครอบครัวพังทลาย',
      'ไม่สามารถโฟกัสหรือทำงานได้โดยไม่มีมือถือ',
    ],
  }
}

/* ─── Score Gauge ─────────────────────────────────────────────────────── */
const ScoreGauge = ({ score, accent }) => {
  const pct = (score / 10) * 100
  const r = 54
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={accent}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black"
          style={{ color: accent }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score.toFixed(1)}
        </motion.span>
        <span className="text-xs text-slate-400 font-bold">/10</span>
      </div>
    </div>
  )
}

/* ─── Result Panel ────────────────────────────────────────────────────── */
const ResultPanel = ({ prediction, lang, onRetake }) => {
  const cfg = getSeverityConfig(prediction.prediction_score)
  const Icon = cfg.icon

  // Derive risk factors from form data stored in prediction (if available)
  // We'll show generic risk factors based on severity
  const tips = lang === 'en' ? cfg.tips_en : cfg.tips_th
  const risks = lang === 'en' ? cfg.risks_en : cfg.risks_th
  const summary = lang === 'en' ? cfg.summary_en : cfg.summary_th

  return (
    <motion.div
      key="result-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* ── Hero card ── */}
      <div className="rounded-3xl overflow-hidden" style={{ background: cfg.bg, border: `1.5px solid ${cfg.accent}30` }}>
        {/* Top strip */}
        <div className="px-8 pt-8 pb-6 flex flex-col sm:flex-row items-center gap-6">
          <ScoreGauge score={prediction.prediction_score} accent={cfg.accent} />

          <div className="flex-1 text-center sm:text-left">
            <span
              className="inline-block text-[10px] font-black tracking-widest px-3 py-1 rounded-full mb-3"
              style={{ background: `${cfg.accent}20`, color: cfg.accent, border: `1px solid ${cfg.accent}40` }}
            >
              {lang === 'en' ? cfg.tag_en : cfg.tag_th}
            </span>
            <h3 className="text-3xl font-black mb-1" style={{ color: cfg.textColor }}>
              {lang === 'en' ? cfg.label_en : cfg.label_th}
            </h3>
            <p className="text-sm font-semibold mb-3" style={{ color: cfg.textColor, opacity: 0.7 }}>
              {lang === 'en' ? 'Severity Score' : 'ระดับความรุนแรง'}: {prediction.prediction_score.toFixed(1)} / 10
            </p>

            {/* Progress bar */}
            <div className="w-full h-2 bg-black/8 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: cfg.accent }}
                initial={{ width: 0 }}
                animate={{ width: `${cfg.pct}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold mt-1" style={{ color: cfg.accent, opacity: 0.7 }}>
              <span>0</span><span>10</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="px-8 pb-8">
          <p className="text-sm leading-relaxed font-medium" style={{ color: cfg.textColor, opacity: 0.85 }}>
            {summary}
          </p>
          {/* API message if available */}
          {prediction.message && prediction.message !== summary && (
            <p className="mt-3 text-sm leading-relaxed italic" style={{ color: cfg.textColor, opacity: 0.6 }}>
              "{prediction.message}"
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* ── Risk factors ── */}
        {risks.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-red-500" />
              <h4 className="font-black text-red-700 text-sm uppercase tracking-wider">
                {lang === 'en' ? 'Risk Factors' : 'ปัจจัยเสี่ยงที่พบ'}
              </h4>
            </div>
            {risks.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-3"
              >
                <span className="mt-1 w-4 h-4 rounded-full bg-red-400 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <p className="text-sm text-red-700 leading-snug">{r}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Recovery tips ── */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-emerald-600" />
            <h4 className="font-black text-emerald-700 text-sm uppercase tracking-wider">
              {lang === 'en' ? 'Action Steps' : 'สิ่งที่ควรทำตอนนี้'}
            </h4>
          </div>
          {tips.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.2 }}
              className="flex items-start gap-3"
            >
              <span className="mt-0.5 font-black text-[10px] w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-emerald-800 leading-snug">{t}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Score breakdown bar ── */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
        <h4 className="font-black text-slate-700 text-sm uppercase tracking-wider mb-5">
          {lang === 'en' ? 'Severity Spectrum — Where You Stand' : 'คุณอยู่ตรงไหนของระดับความเสี่ยง'}
        </h4>
        <div className="relative">
          <div className="h-3 rounded-full overflow-hidden" style={{
            background: 'linear-gradient(to right,#22c55e,#f59e0b,#f97316,#ef4444,#991b1b)'
          }} />
          {/* marker — each zone spans 20% of bar width */}
          {(() => {
            const s = prediction.prediction_score
            let zonePct
            if (s < 5.0) zonePct = (s / 5.0) * 20
            else if (s < 8.0) zonePct = 20 + ((s - 5.0) / 3.0) * 20
            else if (s < 9.0) zonePct = 40 + ((s - 8.0) / 1.0) * 20
            else if (s < 10.0) zonePct = 60 + ((s - 9.0) / 1.0) * 20
            else zonePct = 90
            return (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-4 border-white shadow-lg"
                style={{ background: cfg.accent, left: `calc(${zonePct}% - 10px)` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
              />
            )
          })()}
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
          {(lang === 'en'
            ? ['Safe', 'Caution', 'Warning', 'Danger', 'Critical']
            : ['ปลอดภัย', 'ระวัง', 'เตือน', 'อันตราย', 'วิกฤต']
          ).map(l => <span key={l}>{l}</span>)}
        </div>
      </div>

      {/* ── CTA row ── */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition w-full sm:w-auto justify-center"
        >
          <RotateCcw size={16} />
          {lang === 'en' ? 'Retake Assessment' : 'ทำแบบประเมินอีกครั้ง'}
        </button>
        <div className="flex-1 text-center text-xs text-slate-400 leading-relaxed">
          {lang === 'en'
            ? '* Results are based on a predictive model and are not a clinical diagnosis.'
            : '* ผลลัพธ์มาจากโมเดลทำนาย ไม่ใช่การวินิจฉัยทางการแพทย์'}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Question Card ───────────────────────────────────────────────────── */
const QuestionCard = ({ icon: Icon, label, description, iconColor, bgColor, children }) => (
  <div className="space-y-6 bg-white/50 p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md h-full">
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-2xl ${bgColor} shrink-0`}>
        <Icon className={iconColor} size={24} />
      </div>
      <div>
        <h4 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{label}</h4>
        <p className="text-sm text-slate-400 font-medium">{description}</p>
      </div>
    </div>
    <div className="pt-2">{children}</div>
  </div>
)

/* ─── Main Assessment ─────────────────────────────────────────────────── */
const Assessment = () => {
  const { lang } = useLanguage()
  const initialFormState = {
    Age: 18, Gender: 1, Daily_Usage_Hours: 4.0, Sleep_Hours: 7.0,
    Academic_Performance: 80, Social_Interactions: 5, Exercise_Hours: 1.0,
    Anxiety_Level: 5, Depression_Level: 5, Self_Esteem: 5,
    Parental_Control: 0, Screen_Time_Before_Bed: 1.0, Phone_Checks_Per_Day: 50,
    Apps_Used_Daily: 10, Time_on_Social_Media: 2.0, Time_on_Gaming: 1.0,
    Time_on_Education: 1.0, Phone_Usage_Purpose: 0, Family_Communication: 5,
    Weekend_Usage_Hours: 5.0
  }

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const [prediction, setPrediction] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const val = e.target.type === 'number' || e.target.type === 'range' ? parseFloat(value) : value
    setFormData(prev => {
      let newState = { ...prev, [name]: val }
      if (name === 'Daily_Usage_Hours' || name === 'Sleep_Hours') {
        if (newState.Daily_Usage_Hours + newState.Sleep_Hours > 24) {
          if (name === 'Daily_Usage_Hours') newState.Sleep_Hours = Math.max(0, 24 - val)
          else newState.Daily_Usage_Hours = Math.max(0, 24 - val)
        }
      }
      const timeFields = ['Time_on_Social_Media', 'Time_on_Gaming', 'Time_on_Education']
      if (timeFields.includes(name) || name === 'Daily_Usage_Hours') {
        let sumSub = newState.Time_on_Social_Media + newState.Time_on_Gaming + newState.Time_on_Education
        if (name === 'Daily_Usage_Hours') {
          if (sumSub > newState.Daily_Usage_Hours && sumSub > 0) {
            const ratio = newState.Daily_Usage_Hours / sumSub
            newState.Time_on_Social_Media = parseFloat((newState.Time_on_Social_Media * ratio).toFixed(1))
            newState.Time_on_Gaming = parseFloat((newState.Time_on_Gaming * ratio).toFixed(1))
            newState.Time_on_Education = parseFloat((newState.Time_on_Education * ratio).toFixed(1))
          }
        } else {
          const otherSum = sumSub - newState[name]
          if (newState[name] + otherSum > newState.Daily_Usage_Hours) {
            newState[name] = Math.max(0, parseFloat((newState.Daily_Usage_Hours - otherSum).toFixed(1)))
          }
        }
      }
      if (['Time_on_Social_Media', 'Time_on_Gaming', 'Time_on_Education'].includes(name)) {
        const values = { 0: newState.Time_on_Social_Media, 1: newState.Time_on_Gaming, 2: newState.Time_on_Education }
        const maxKey = Object.keys(values).reduce((a, b) => values[a] > values[b] ? a : b)
        newState.Phone_Usage_Purpose = parseInt(maxKey)
      }
      return newState
    })
  }

  const handleSubmit = async () => {
    const sanitizedData = Object.keys(formData).reduce((acc, key) => {
      let value = formData[key]
      if (typeof value === 'number' && isNaN(value)) value = 0
      acc[key] = value
      return acc
    }, {})
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/prediction/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || `Server Error: ${res.status}`)
      }
      const data = await res.json()
      setPrediction(data)
      setStep(6)
    } catch (err) {
      console.error(err)
      alert(lang === 'en'
        ? `❌ Prediction failed: ${err.message}\n(Please check if Backend is running)`
        : `❌ ทำนายไม่ได้: ${err.message}\n(กรุณาตรวจสอบว่า Backend รันอยู่)`)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={User} label={lang === 'en' ? "Age" : "อายุ"} description={lang === 'en' ? "Your current age" : "กรอกอายุของคุณ"} iconColor="text-blue-600" bgColor="bg-blue-600/10">
              <input type="number" name="Age" value={formData.Age} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Users} label={lang === 'en' ? "Gender" : "เพศ"} description={lang === 'en' ? "Biological gender" : "เพศสภาพ"} iconColor="text-indigo-600" bgColor="bg-indigo-600/10">
              <div className="flex space-x-2">
                {[1, 2].map(v => (
                  <button key={v} onClick={() => setFormData({ ...formData, Gender: v })} className={`flex-1 py-3 rounded-2xl font-bold ${formData.Gender === v ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>
                    {v === 1 ? (lang === 'en' ? 'Male' : 'ชาย') : (lang === 'en' ? 'Female' : 'หญิง')}
                  </button>
                ))}
              </div>
            </QuestionCard>
            <QuestionCard icon={Clock} label={lang === 'en' ? "Weekday Usage (hrs)" : "ใช้งานวันธรรมดา (ชม.)"} description="Daily phone usage" iconColor="text-blue-600" bgColor="bg-blue-600/10">
              <input type="range" min="0" max="24" step="0.5" name="Daily_Usage_Hours" value={formData.Daily_Usage_Hours} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Daily_Usage_Hours} {lang === 'en' ? 'hrs' : 'ชม.'}</div>
            </QuestionCard>
            <QuestionCard icon={Moon} label={lang === 'en' ? "Sleep Duration (hrs)" : "นอนหลับ (ชม.)"} description="Average nightly sleep" iconColor="text-indigo-600" bgColor="bg-indigo-600/10">
              <input type="range" min="0" max="24" step="0.5" name="Sleep_Hours" value={formData.Sleep_Hours} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Sleep_Hours} {lang === 'en' ? 'hrs' : 'ชม.'}</div>
              <p className="text-[10px] text-slate-400 mt-2">{lang === 'en' ? '* Usage + Sleep must not exceed 24 hrs' : '* รวมกับเวลาใช้งานต้องไม่เกิน 24 ชม.'}</p>
            </QuestionCard>
          </motion.div>
        )
      case 2:
        return (
          <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={Users} label={lang === 'en' ? "Social Media (hrs)" : "โซเชียลมีเดีย (ชม.)"} description="Apps like Facebook, IG, X" iconColor="text-blue-500" bgColor="bg-blue-500/10">
              <input type="range" min="0" max={formData.Daily_Usage_Hours} step="0.1" name="Time_on_Social_Media" value={formData.Time_on_Social_Media} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Time_on_Social_Media} {lang === 'en' ? 'hrs' : 'ชม.'}</div>
            </QuestionCard>
            <QuestionCard icon={Gamepad2} label={lang === 'en' ? "Gaming (hrs)" : "เล่นเกม (ชม.)"} description="Mobile & online gaming" iconColor="text-purple-500" bgColor="bg-purple-500/10">
              <input type="range" min="0" max={formData.Daily_Usage_Hours} step="0.1" name="Time_on_Gaming" value={formData.Time_on_Gaming} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Time_on_Gaming} {lang === 'en' ? 'hrs' : 'ชม.'}</div>
            </QuestionCard>
            <QuestionCard icon={BookOpen} label={lang === 'en' ? "Education (hrs)" : "เพื่อการศึกษา (ชม.)"} description="Study & research tools" iconColor="text-emerald-500" bgColor="bg-emerald-500/10">
              <input type="range" min="0" max={formData.Daily_Usage_Hours} step="0.1" name="Time_on_Education" value={formData.Time_on_Education} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Time_on_Education} {lang === 'en' ? 'hrs' : 'ชม.'}</div>
            </QuestionCard>
            <QuestionCard icon={Activity} label={lang === 'en' ? "Main Purpose" : "วัตถุประสงค์หลัก"} description="Your primary activity" iconColor="text-slate-600" bgColor="bg-slate-600/10">
              <select name="Phone_Usage_Purpose" value={formData.Phone_Usage_Purpose} onChange={handleInputChange} className="input-premium">
                <option value={0}>{lang === 'en' ? 'Social Media' : 'โซเชียลมีเดีย'}</option>
                <option value={1}>{lang === 'en' ? 'Gaming' : 'เล่นเกม'}</option>
                <option value={2}>{lang === 'en' ? 'Education' : 'การศึกษา'}</option>
                <option value={3}>{lang === 'en' ? 'Work' : 'งาน'}</option>
                <option value={4}>{lang === 'en' ? 'Entertainment' : 'ความบันเทิง'}</option>
              </select>
            </QuestionCard>
          </motion.div>
        )
      case 3:
        return (
          <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={MousePointer2} label={lang === 'en' ? "Phone Checks" : "เช็กมือถือ (ครั้ง/วัน)"} description="Checks per day" iconColor="text-amber-600" bgColor="bg-amber-600/10">
              <input type="number" name="Phone_Checks_Per_Day" value={formData.Phone_Checks_Per_Day} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Smartphone} label={lang === 'en' ? "Daily Apps" : "แอปที่ใช้บ่อย (จำนวน)"} description="Apps used daily" iconColor="text-amber-600" bgColor="bg-amber-600/10">
              <input type="number" name="Apps_Used_Daily" value={formData.Apps_Used_Daily} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Smartphone} label={lang === 'en' ? "Weekend Usage (hrs)" : "ใช้งานวันหยุด (ชม.)"} description="Average weekend hours" iconColor="text-indigo-600" bgColor="bg-indigo-600/10">
              <input type="range" min="0" max="24" step="0.5" name="Weekend_Usage_Hours" value={formData.Weekend_Usage_Hours} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Weekend_Usage_Hours} {lang === 'en' ? 'hrs' : 'ชม.'}</div>
            </QuestionCard>
            <QuestionCard icon={Moon} label={lang === 'en' ? "Before Bed (hrs)" : "ใช้ก่อนนอน (ชม.)"} description="Hours before sleep" iconColor="text-rose-600" bgColor="bg-rose-600/10">
              <input type="number" step="0.5" name="Screen_Time_Before_Bed" value={formData.Screen_Time_Before_Bed} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
          </motion.div>
        )
      case 4:
        return (
          <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={Brain} label={lang === 'en' ? "Anxiety" : "ความกังวล (1-10)"} description="Stress & worry" iconColor="text-rose-600" bgColor="bg-rose-600/10">
              <input type="range" min="1" max="10" name="Anxiety_Level" value={formData.Anxiety_Level} onChange={handleInputChange} className="range-premium accent-rose-600" />
              <div className="text-right font-bold">{formData.Anxiety_Level}</div>
            </QuestionCard>
            <QuestionCard icon={Heart} label={lang === 'en' ? "Depression" : "ความเศร้า (1-10)"} description="Mood & sadness" iconColor="text-rose-600" bgColor="bg-rose-600/10">
              <input type="range" min="1" max="10" name="Depression_Level" value={formData.Depression_Level} onChange={handleInputChange} className="range-premium accent-rose-600" />
              <div className="text-right font-bold">{formData.Depression_Level}</div>
            </QuestionCard>
            <QuestionCard icon={Activity} label={lang === 'en' ? "Self Esteem" : "ความภูมิใจในตนเอง (1-10)"} description="Self-worth level" iconColor="text-green-600" bgColor="bg-green-600/10">
              <input type="range" min="1" max="10" name="Self_Esteem" value={formData.Self_Esteem} onChange={handleInputChange} className="range-premium accent-green-600" />
              <div className="text-right font-bold">{formData.Self_Esteem}</div>
            </QuestionCard>
            <QuestionCard icon={Users} label={lang === 'en' ? "Family Comm" : "การคุยกับครอบครัว (1-10)"} description="Connection with family" iconColor="text-blue-600" bgColor="bg-blue-600/10">
              <input type="range" min="1" max="10" name="Family_Communication" value={formData.Family_Communication} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Family_Communication}</div>
            </QuestionCard>
          </motion.div>
        )
      case 5:
        return (
          <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={Users} label={lang === 'en' ? "Social Context" : "เพื่อนใหม่ (คน/วัน)"} description="New interactions daily" iconColor="text-blue-600" bgColor="bg-blue-600/10">
              <input type="number" name="Social_Interactions" value={formData.Social_Interactions} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Activity} label={lang === 'en' ? "Academic Performance" : "เกรดเฉลี่ย (%)"} description="Scores & results" iconColor="text-green-600" bgColor="bg-green-600/10">
              <input type="number" name="Academic_Performance" value={formData.Academic_Performance} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Activity} label={lang === 'en' ? "Exercise" : "ออกกำลังกาย (ชม./วัน)"} description="Daily physical activity" iconColor="text-orange-600" bgColor="bg-orange-600/10">
              <input type="number" step="0.5" name="Exercise_Hours" value={formData.Exercise_Hours} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Lock} label={lang === 'en' ? "Parental Control" : "พ่อแม่คุม"} description="External monitoring" iconColor="text-slate-600" bgColor="bg-slate-600/10">
              <div className="flex space-x-2">
                {[0, 1].map(v => (
                  <button key={v} onClick={() => setFormData({ ...formData, Parental_Control: v })} className={`flex-1 py-3 rounded-2xl font-bold ${formData.Parental_Control === v ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}>
                    {v === 0 ? (lang === 'en' ? 'None' : 'ไม่มี') : (lang === 'en' ? 'Active' : 'มี')}
                  </button>
                ))}
              </div>
            </QuestionCard>
          </motion.div>
        )
      default: return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          {lang === 'en' ? 'Nomophobia Assessment' : 'แบบประเมินภาวะโนโมโฟเบีย'}
        </h2>
        <p className="text-slate-500 font-medium">
          {step <= 5
            ? (lang === 'en' ? `Step ${step} of 5` : `ขั้นตอนที่ ${step} จาก 5`)
            : (lang === 'en' ? 'Diagnostic Result' : 'ผลการวินิจฉัย')}
        </p>
      </div>

      <div className="glass-card p-8 md:p-12 bg-white rounded-3xl shadow-xl border border-slate-100">
        <AnimatePresence mode="wait">
          {step <= 5 ? (
            <div key="form-view">
              {renderStep()}
              <div className="flex justify-between mt-12 pt-8 border-t">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="px-8 py-3 font-bold text-slate-400">
                    {lang === 'en' ? 'Back' : 'ย้อนกลับ'}
                  </button>
                )}
                {step < 5 ? (
                  <button onClick={() => setStep(step + 1)} className="btn-premium ml-auto bg-blue-600 text-white px-8 py-3 rounded-xl flex items-center gap-2">
                    {lang === 'en' ? 'Next' : 'ถัดไป'} <ChevronRight size={18} />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading} className="btn-premium ml-auto bg-slate-900 text-white px-8 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50">
                    {loading
                      ? (lang === 'en' ? 'Analyzing...' : 'กำลังวิเคราะห์...')
                      : (lang === 'en' ? 'Get Result' : 'ส่งข้อมูลทำนาย')}
                    <Zap size={18} />
                  </button>
                )}
              </div>
            </div>
          ) : prediction ? (
            <ResultPanel
              prediction={prediction}
              lang={lang}
              onRetake={() => { setStep(1); setPrediction(null) }}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <style>{`
        .input-premium { width: 100%; padding: 0.75rem 1rem; border: 2px solid #f1f5f9; border-radius: 1rem; font-weight: 700; outline: none; transition: 0.2s; }
        .input-premium:focus { border-color: #3b82f6; }
        .range-premium { width: 100%; cursor: pointer; }
      `}</style>
    </div>
  )
}

export default Assessment