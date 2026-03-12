import React, { useState } from 'react'
import {
  Zap,
  PhoneOff,
  ShieldCheck,
  User,
  Clock,
  MousePointer2,
  Moon,
  Brain,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Gamepad2,
  BookOpen,
  Activity,
  Heart,
  Users,
  Lock,
  Smartphone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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
    <div className="pt-2">
      {children}
    </div>
  </div>
)

const Assessment = () => {
  const { lang } = useLanguage()
  const initialFormState = {
    Age: 18,
    Gender: 1,
    Daily_Usage_Hours: 4.0,
    Sleep_Hours: 7.0,
    Academic_Performance: 80,
    Social_Interactions: 5,
    Exercise_Hours: 1.0,
    Anxiety_Level: 5,
    Depression_Level: 5,
    Self_Esteem: 5,
    Parental_Control: 0,
    Screen_Time_Before_Bed: 1.0,
    Phone_Checks_Per_Day: 50,
    Apps_Used_Daily: 10,
    Time_on_Social_Media: 2.0,
    Time_on_Gaming: 1.0,
    Time_on_Education: 1.0,
    Phone_Usage_Purpose: 0,
    Family_Communication: 5,
    Weekend_Usage_Hours: 5.0
  }

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const [prediction, setPrediction] = useState(null)

  const handleReset = () => {
    setFormData(initialFormState)
    setPrediction(null)
    setStep(1)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const val = e.target.type === 'number' || e.target.type === 'range' ? parseFloat(value) : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Backend error')

      const data = await res.json()
      setPrediction(data)
      setStep(6) // Result step
    } catch (err) {
      console.error('Submission error:', err)
      const errorMsg = lang === 'en' 
        ? '❌ Unable to connect to server. Please check if Backend (app.py) is running.' 
        : '❌ ไม่สามารถเชื่อมต่อกับ Server ได้ กรุณาตรวจสอบว่า Backend (app.py) กำลังรันอยู่ในขณะนี้'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, 1))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Personal Profile */}
            <QuestionCard 
              icon={User} 
              label={lang === 'en' ? "Age" : "อายุ"} 
              description={lang === 'en' ? "Enter your current age." : "กรอกอายุปัจจุบันของคุณ"} 
              iconColor="text-blue-600" 
              bgColor="bg-blue-600/10"
            >
              <input type="number" name="Age" value={formData.Age} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard 
              icon={Users} 
              label={lang === 'en' ? "Gender" : "เพศ"} 
              description={lang === 'en' ? "Biological gender for baseline." : "เพศโดยกำเนิดเพื่อใช้เป็นค่าพื้นฐาน"} 
              iconColor="text-indigo-600" 
              bgColor="bg-indigo-600/10"
            >
              <div className="flex space-x-2">
                {[1, 2].map(v => (
                  <button key={v} onClick={() => setFormData({ ...formData, Gender: v })} className={`flex-1 py-3 rounded-2xl font-bold transition-all ${formData.Gender === v ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                    {v === 1 ? (lang === 'en' ? 'Male' : 'ชาย') : (lang === 'en' ? 'Female' : 'หญิง')}
                  </button>
                ))}
              </div>
            </QuestionCard>

            {/* Usage Habits */}
            <QuestionCard 
              icon={Clock} 
              label={lang === 'en' ? "Daily Usage" : "ชั่วโมงการใช้งาน"} 
              description={lang === 'en' ? "Average hours per day." : "จำนวนชั่วโมงที่ใช้งานเฉลี่ยต่อวัน"} 
              iconColor="text-blue-600" 
              bgColor="bg-blue-600/10"
            >
              <div className="flex justify-between mb-2">
                <span className="text-2xl font-black text-blue-600">{formData.Daily_Usage_Hours}{lang === 'en' ? 'h' : ' ชม.'}</span>
              </div>
              <input type="range" min="0" max="24" step="0.5" name="Daily_Usage_Hours" value={formData.Daily_Usage_Hours} onChange={handleInputChange} className="range-premium accent-blue-600" />
            </QuestionCard>
            <QuestionCard 
              icon={MousePointer2} 
              label={lang === 'en' ? "Phone Checks" : "จำนวนการเช็คโทรศัพท์"} 
              description={lang === 'en' ? "Number of unlocks per day." : "จำนวนครั้งที่ปลดล็อคหน้าจอต่อวัน"} 
              iconColor="text-amber-600" 
              bgColor="bg-amber-600/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-black text-amber-600">{formData.Phone_Checks_Per_Day} {lang === 'en' ? 'Times' : 'ครั้ง'}</span>
              </div>
              <input type="number" name="Phone_Checks_Per_Day" value={formData.Phone_Checks_Per_Day} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>

            {/* Well-being */}
            <QuestionCard 
              icon={Moon} 
              label={lang === 'en' ? "Sleep Duration" : "เวลานอน"} 
              description={lang === 'en' ? "Total hours of sleep per night." : "จำนวนชั่วโมงที่นอนต่อคืน"} 
              iconColor="text-indigo-600" 
              bgColor="bg-indigo-600/10"
            >
              <div className="flex justify-between mb-2">
                <span className="text-2xl font-black text-indigo-600">{formData.Sleep_Hours}{lang === 'en' ? 'h' : ' ชม.'}</span>
              </div>
              <input type="range" min="0" max="12" step="0.5" name="Sleep_Hours" value={formData.Sleep_Hours} onChange={handleInputChange} className="range-premium accent-indigo-600" />
            </QuestionCard>
            <QuestionCard 
              icon={Moon} 
              label={lang === 'en' ? "Bedtime Screen" : "ใช้งานก่อนนอน"} 
              description={lang === 'en' ? "Hours used after getting in bed." : "ชั่วโมงที่ใข้งานหลังจากเข้านอนแล้ว"} 
              iconColor="text-rose-600" 
              bgColor="bg-rose-600/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-black text-rose-600">{formData.Screen_Time_Before_Bed}{lang === 'en' ? 'h' : ' ชม.'}</span>
              </div>
              <input type="number" step="0.5" name="Screen_Time_Before_Bed" value={formData.Screen_Time_Before_Bed} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>

            {/* Core Psych Factor */}
            <QuestionCard 
              icon={Brain} 
              label={lang === 'en' ? "Anxiety Level" : "ระดับความกังวล"} 
              description={lang === 'en' ? "Feeling when phone is disconnected." : "ความรู้สึกเมื่อไม่ได้ใช้หรือลืมโทรศัพท์"} 
              iconColor="text-rose-600" 
              bgColor="bg-rose-600/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-2xl font-black text-rose-600">{formData.Anxiety_Level}/10</span>
              </div>
              <input type="range" min="1" max="10" name="Anxiety_Level" value={formData.Anxiety_Level} onChange={handleInputChange} className="range-premium accent-rose-600" />
            </QuestionCard>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-2">
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-xs font-black text-blue-800 uppercase tracking-widest">
            {lang === 'en' ? 'Clinical Research Study' : 'งานวิจัยทางคลินิก'}
          </span>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          {lang === 'en' ? 'Nomophobia Assessment' : 'แบบประเมินภาวะโนโมโฟเบีย'}
        </h2>
        <p className="text-slate-500 font-medium">
          {step < 2 
            ? (lang === 'en' ? 'Important Prediction Factors' : 'ปัจจัยสำคัญในการวิเคราะห์') 
            : (lang === 'en' ? 'Diagnostic Result' : 'ผลการประเมิน')}
        </p>
      </div>

      {step < 2 && (
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
          <motion.div className="h-full bg-blue-600" initial={{ width: '0%' }} animate={{ width: `100%` }} />
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 w-full" />
        <div className="p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step < 2 ? (
              <div key="form-container">
                {renderStep()}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
                  <button onClick={handleReset} className="flex items-center space-x-2 text-slate-400 font-bold hover:text-rose-600 transition-colors">
                    <Activity size={20} />
                    <span>{lang === 'en' ? 'Reset Values' : 'กรอกใหม่'}</span>
                  </button>

                  <button onClick={handleSubmit} disabled={loading} className="btn-premium flex items-center space-x-3 bg-slate-900">
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap size={20} />
                        <span>{lang === 'en' ? 'Run Research Model' : 'เริ่มการทำนาย'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : prediction && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10">
                    <PhoneOff size={200} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-700 pb-8 mb-8">
                      <div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">
                          {lang === 'en' ? `Diagnostic Model Output (${prediction.model_type})` : `ผลลัพธ์จากโมเดล (${prediction.model_type})`}
                        </span>
                        <h3 className={`text-4xl font-black mt-2 leading-tight ${prediction.prediction_score >= 8 ? 'text-rose-500' : prediction.prediction_score >= 5 ? 'text-amber-500' : 'text-emerald-500'}`}>{prediction.prediction_label}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                          {lang === 'en' ? 'Severity Score' : 'ระดับความรุนแรง'}
                        </span>
                        <p className={`text-6xl font-black mt-1 ${prediction.prediction_score >= 8 ? 'text-rose-500' : prediction.prediction_score >= 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {prediction.prediction_score}<span className="text-2xl text-slate-500">/10</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${prediction.prediction_score * 10}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className={`h-full ${prediction.prediction_score >= 8 ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : prediction.prediction_score >= 5 ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]'}`} />
                      </div>

                      <div className="flex items-start space-x-4 bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
                        <div className="bg-blue-600/20 p-2 rounded-xl">
                          <ShieldCheck className="text-blue-400" size={24} />
                        </div>
                        <p className="text-slate-300 leading-relaxed font-medium">
                          {prediction.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button onClick={handleReset} className="flex items-center space-x-2 text-slate-500 font-bold hover:text-blue-600 transition-colors">
                    <span>{lang === 'en' ? 'Recalibrate & Retake' : 'ประเมินใหม่อีกครั้ง'}</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .input-premium {
          width: 100%;
          padding: 1rem 1.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.2s;
          outline: none;
        }
        .input-premium:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
        .range-premium {
          width: 100%;
          height: 0.5rem;
          background: #f1f5f9;
          border-radius: 9999px;
          appearance: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default Assessment
