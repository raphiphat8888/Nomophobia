import React, { useState } from 'react'
import {
  Zap, PhoneOff, ShieldCheck, User, Clock, MousePointer2, Moon, Brain,
  ChevronRight, Sparkles, Gamepad2, BookOpen, Activity, Heart, Users, Lock, Smartphone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE_URL = 'http://localhost:8000'

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

const Assessment = () => {
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
      let newState = { ...prev, [name]: val };
      
      // Constraint: Daily_Usage_Hours + Sleep_Hours <= 24
      if (name === 'Daily_Usage_Hours' || name === 'Sleep_Hours') {
        if (newState.Daily_Usage_Hours + newState.Sleep_Hours > 24) {
          if (name === 'Daily_Usage_Hours') newState.Sleep_Hours = Math.max(0, 24 - val);
          else newState.Daily_Usage_Hours = Math.max(0, 24 - val);
        }
      }

      // Constraint: Social + Gaming + Education must be <= Daily_Usage_Hours
      const timeFields = ['Time_on_Social_Media', 'Time_on_Gaming', 'Time_on_Education'];
      if (timeFields.includes(name) || name === 'Daily_Usage_Hours') {
        let sumSub = newState.Time_on_Social_Media + newState.Time_on_Gaming + newState.Time_on_Education;
        
        if (name === 'Daily_Usage_Hours') {
          // If total usage is reduced, scale down categories proportionally if they exceed total
          if (sumSub > newState.Daily_Usage_Hours) {
            if (sumSub > 0) {
              const ratio = newState.Daily_Usage_Hours / sumSub;
              newState.Time_on_Social_Media = parseFloat((newState.Time_on_Social_Media * ratio).toFixed(1));
              newState.Time_on_Gaming = parseFloat((newState.Time_on_Gaming * ratio).toFixed(1));
              newState.Time_on_Education = parseFloat((newState.Time_on_Education * ratio).toFixed(1));
            }
          }
        } else {
          // If a category is increased, make sure it doesn't push the sum over Daily_Usage_Hours
          const otherSum = sumSub - newState[name];
          if (newState[name] + otherSum > newState.Daily_Usage_Hours) {
            newState[name] = Math.max(0, parseFloat((newState.Daily_Usage_Hours - otherSum).toFixed(1)));
          }
        }
      }

      // Auto-update Purpose based on highest category
      if (timeFields.includes(name)) {
        const values = {
          0: newState.Time_on_Social_Media,
          1: newState.Time_on_Gaming,
          2: newState.Time_on_Education
        };
        const maxKey = Object.keys(values).reduce((a, b) => values[a] > values[b] ? a : b);
        newState.Phone_Usage_Purpose = parseInt(maxKey);
      }
      
      return newState;
    })
  }

  const handleSubmit = async () => {
    // Sanitize data: Ensure all fields are numbers and handle NaN
    const sanitizedData = Object.keys(formData).reduce((acc, key) => {
      let value = formData[key];
      if (typeof value === 'number' && isNaN(value)) value = 0;
      acc[key] = value;
      return acc;
    }, {});

    console.log("Sending Sanitized Data:", sanitizedData)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/prediction/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server Error: ${res.status}`);
      }
      
      const data = await res.json()
      setPrediction(data)
      setStep(6) 
    } catch (err) {
      console.error(err);
      alert(`❌ ทำนายไม่ได้: ${err.message}\n(กรุณาตรวจสอบว่า Backend รันอยู่หรือข้อมูลถูกต้อง)`)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1: // Personal & Basic Time
        return (
          <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={User} label="อายุ" description="Age" iconColor="text-blue-600" bgColor="bg-blue-600/10">
              <input type="number" name="Age" value={formData.Age} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Users} label="เพศ" description="Gender" iconColor="text-indigo-600" bgColor="bg-indigo-600/10">
              <div className="flex space-x-2">
                {[1, 2].map(v => (
                  <button key={v} onClick={() => setFormData({ ...formData, Gender: v })} className={`flex-1 py-3 rounded-2xl font-bold ${formData.Gender === v ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>
                    {v === 1 ? 'ชาย' : 'หญิง'}
                  </button>
                ))}
              </div>
            </QuestionCard>
            <QuestionCard icon={Clock} label="ใช้งานวันธรรมดา (ชม.)" description="Weekday Usage" iconColor="text-blue-600" bgColor="bg-blue-600/10">
              <input type="range" min="0" max="24" step="0.5" name="Daily_Usage_Hours" value={formData.Daily_Usage_Hours} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Daily_Usage_Hours} ชม.</div>
            </QuestionCard>
            <QuestionCard icon={Moon} label="นอนหลับ (ชม.)" description="Sleep Duration" iconColor="text-indigo-600" bgColor="bg-indigo-600/10">
              <input type="range" min="0" max="24" step="0.5" name="Sleep_Hours" value={formData.Sleep_Hours} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Sleep_Hours} ชม.</div>
              <p className="text-[10px] text-slate-400 mt-2">* รวมกับเวลาใช้งานต้องไม่เกิน 24 ชม.</p>
            </QuestionCard>
          </motion.div>
        )
      case 2: // Usage Categories
        return (
          <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={Users} label="โซเชียลมีเดีย (ชม.)" description="Social Media" iconColor="text-blue-500" bgColor="bg-blue-500/10">
              <input type="range" min="0" max={formData.Daily_Usage_Hours} step="0.1" name="Time_on_Social_Media" value={formData.Time_on_Social_Media} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Time_on_Social_Media} ชม.</div>
            </QuestionCard>
            <QuestionCard icon={Gamepad2} label="เล่นเกม (ชม.)" description="Gaming" iconColor="text-purple-500" bgColor="bg-purple-500/10">
              <input type="range" min="0" max={formData.Daily_Usage_Hours} step="0.1" name="Time_on_Gaming" value={formData.Time_on_Gaming} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Time_on_Gaming} ชม.</div>
            </QuestionCard>
            <QuestionCard icon={BookOpen} label="เพื่อการศึกษา (ชม.)" description="Education" iconColor="text-emerald-500" bgColor="bg-emerald-500/10">
              <input type="range" min="0" max={formData.Daily_Usage_Hours} step="0.1" name="Time_on_Education" value={formData.Time_on_Education} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Time_on_Education} ชม.</div>
            </QuestionCard>
            <QuestionCard icon={Activity} label="วัตถุประสงค์หลัก" description="Main Purpose" iconColor="text-slate-600" bgColor="bg-slate-600/10">
              <select name="Phone_Usage_Purpose" value={formData.Phone_Usage_Purpose} onChange={handleInputChange} className="input-premium">
                <option value={0}>Social Media</option>
                <option value={1}>Gaming</option>
                <option value={2}>Education</option>
                <option value={3}>Work</option>
                <option value={4}>Entertainment</option>
              </select>
            </QuestionCard>
          </motion.div>
        )
      case 3: // Usage Habits
        return (
          <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={MousePointer2} label="เช็กมือถือ (ครั้ง/วัน)" description="Phone Checks" iconColor="text-amber-600" bgColor="bg-amber-600/10">
              <input type="number" name="Phone_Checks_Per_Day" value={formData.Phone_Checks_Per_Day} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Smartphone} label="แอปที่ใช้บ่อย (จำนวน)" description="Daily Apps" iconColor="text-amber-600" bgColor="bg-amber-600/10">
              <input type="number" name="Apps_Used_Daily" value={formData.Apps_Used_Daily} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Smartphone} label="ใช้งานวันหยุด (ชม.)" description="Weekend Usage" iconColor="text-indigo-600" bgColor="bg-indigo-600/10">
              <input type="range" min="0" max="24" step="0.5" name="Weekend_Usage_Hours" value={formData.Weekend_Usage_Hours} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Weekend_Usage_Hours} ชม.</div>
            </QuestionCard>
            <QuestionCard icon={Moon} label="ใช้ก่อนนอน (ชม.)" description="Before Bed" iconColor="text-rose-600" bgColor="bg-rose-600/10">
              <input type="number" step="0.5" name="Screen_Time_Before_Bed" value={formData.Screen_Time_Before_Bed} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
          </motion.div>
        )
      case 4: // Psychological Factors
        return (
          <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={Brain} label="ความกังวล (1-10)" description="Anxiety" iconColor="text-rose-600" bgColor="bg-rose-600/10">
              <input type="range" min="1" max="10" name="Anxiety_Level" value={formData.Anxiety_Level} onChange={handleInputChange} className="range-premium accent-rose-600" />
              <div className="text-right font-bold">{formData.Anxiety_Level}</div>
            </QuestionCard>
            <QuestionCard icon={Heart} label="ความเศร้า (1-10)" description="Depression" iconColor="text-rose-600" bgColor="bg-rose-600/10">
              <input type="range" min="1" max="10" name="Depression_Level" value={formData.Depression_Level} onChange={handleInputChange} className="range-premium accent-rose-600" />
              <div className="text-right font-bold">{formData.Depression_Level}</div>
            </QuestionCard>
            <QuestionCard icon={Activity} label="ความภูมิใจในตนเอง (1-10)" description="Self Esteem" iconColor="text-green-600" bgColor="bg-green-600/10">
              <input type="range" min="1" max="10" name="Self_Esteem" value={formData.Self_Esteem} onChange={handleInputChange} className="range-premium accent-green-600" />
              <div className="text-right font-bold">{formData.Self_Esteem}</div>
            </QuestionCard>
            <QuestionCard icon={Users} label="การคุยกับครอบครัว (1-10)" description="Family Comm" iconColor="text-blue-600" bgColor="bg-blue-600/10">
              <input type="range" min="1" max="10" name="Family_Communication" value={formData.Family_Communication} onChange={handleInputChange} className="range-premium" />
              <div className="text-right font-bold">{formData.Family_Communication}</div>
            </QuestionCard>
          </motion.div>
        )
      case 5: // Social & Others
        return (
          <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuestionCard icon={Users} label="เพื่อนใหม่ (คน/วัน)" description="Social Interactions" iconColor="text-blue-600" bgColor="bg-blue-600/10">
              <input type="number" name="Social_Interactions" value={formData.Social_Interactions} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Activity} label="เกรดเฉลี่ย (%)" description="Academic" iconColor="text-green-600" bgColor="bg-green-600/10">
              <input type="number" name="Academic_Performance" value={formData.Academic_Performance} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Activity} label="ออกกำลังกาย (ชม./วัน)" description="Exercise" iconColor="text-orange-600" bgColor="bg-orange-600/10">
              <input type="number" step="0.5" name="Exercise_Hours" value={formData.Exercise_Hours} onChange={handleInputChange} className="input-premium" />
            </QuestionCard>
            <QuestionCard icon={Lock} label="พ่อแม่คุม (0=ไม่/1=ใช่)" description="Parental Control" iconColor="text-slate-600" bgColor="bg-slate-600/10">
              <div className="flex space-x-2">
                {[0, 1].map(v => (
                  <button key={v} onClick={() => setFormData({ ...formData, Parental_Control: v })} className={`flex-1 py-3 rounded-2xl font-bold ${formData.Parental_Control === v ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}>
                    {v === 0 ? 'ไม่มี' : 'มี'}
                  </button>
                ))}
              </div>
            </QuestionCard>
          </motion.div>
        )
      default: return null;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Nomophobia Assessment</h2>
        <p className="text-slate-500 font-medium">
          {step <= 5 ? `Step ${step} of 5` : 'Diagnostic Result'}
        </p>
      </div>

      <div className="glass-card p-8 md:p-12 bg-white rounded-3xl shadow-xl border border-slate-100">
        <AnimatePresence mode="wait">
          {step <= 5 ? (
            <div key="form-view">
              {renderStep()}
              <div className="flex justify-between mt-12 pt-8 border-t">
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="px-8 py-3 font-bold text-slate-400">ย้อนกลับ</button>
                )}
                {step < 5 ? (
                  <button onClick={() => setStep(step + 1)} className="btn-premium ml-auto bg-blue-600 text-white px-8 py-3 rounded-xl flex items-center gap-2">ถัดไป <ChevronRight size={18} /></button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading} className="btn-premium ml-auto bg-slate-900 text-white px-8 py-3 rounded-xl flex items-center gap-2">
                    {loading ? "กำลังวิเคราะห์..." : "ส่งข้อมูลทำนาย"} <Zap size={18} />
                  </button>
                )}
              </div>
            </div>
          ) : prediction && (
            <motion.div key="result-view" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
              <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white">
                <span className="text-blue-400 font-black uppercase tracking-widest text-xs">Diagnostic Result</span>
                <h3 className="text-5xl font-black mt-4">{prediction.prediction_label}</h3>
                <p className="mt-6 text-slate-400 text-lg leading-relaxed">{prediction.message}</p>
                <div className="mt-8 pt-8 border-t border-slate-800">
                  <p className="text-slate-500 text-sm">Severity Score: {prediction.prediction_score}/10</p>
                </div>
              </div>
              <button onClick={() => { setStep(1); setPrediction(null); }} className="text-blue-600 font-bold">ทำแบบประเมินอีกครั้ง</button>
            </motion.div>
          )}
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