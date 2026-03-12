import { 
  Clock, 
  Bell, 
  ShieldCheck, 
  Users,
  PhoneOff,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const Education = () => {
  const { lang } = useLanguage()
  
  const tips = [
    { 
      title: lang === 'en' ? "Digital Fasting" : "การถือศีลอดดิจิทัล", 
      desc: lang === 'en' ? "Designate 2 hours before bed as 'No-Phone Zones' to improve REM sleep and reduce anxiety." : "กำหนด 2 ชั่วโมงก่อนนอนเป็น 'พื้นที่ปลอดโทรศัพท์' เพื่อปรับปรุงการนอนหลับและลดความกังวล", 
      icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" 
    },
    { 
      title: lang === 'en' ? "Notification Audit" : "ตรวจสอบการแจ้งเตือน", 
      desc: lang === 'en' ? "Disable all non-essential notifications. Keep only human conversations and emergencies." : "ปิดการแจ้งเตือนที่ไม่จำเป็นทั้งหมด เหลือไว้เพียงการสนทนาที่สำคัญและเหตุฉุกเฉิน", 
      icon: Bell, color: "text-indigo-500", bg: "bg-indigo-500/10" 
    },
    { 
      title: lang === 'en' ? "Physical Boundaries" : "สร้างขอบเขตทางกายภาพ", 
      desc: lang === 'en' ? "Never bring your device to the dining table or bathroom to break habitual checking." : "ห้ามนำอุปกรณ์ของคุณไปที่โต๊ะอาหารหรือห้องน้ำเพื่อทำลายพฤติกรรมการเช็คโทรศัพท์จนติดเป็นนิสัย", 
      icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" 
    },
    { 
      title: lang === 'en' ? "Human First" : "ให้ความสำคัญกับคนตรงหน้า", 
      desc: lang === 'en' ? "Prioritize physical eye-contact over screen interactions during social gatherings." : "ให้ความสำคัญกับการสบตาและการสื่อสารแบบเจอหน้ากันมากกว่าการโต้ตอบผ่านหน้าจอในงานสังคม", 
      icon: Users, color: "text-rose-500", bg: "bg-rose-500/10" 
    }
  ]

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          {lang === 'en' ? "Recovery & Prevention" : "การกู้คืนและการป้องกัน"}
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          {lang === 'en' ? "Expert-curated strategies to reclaim your digital sovereignty." : "กลยุทธ์ที่คัดสรรโดยผู้เชี่ยวชาญเพื่อทวงคืนอำนาจอธิปไตยดิจิทัลของคุณ"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-8 flex space-x-6 items-start"
          >
            <div className={`p-4 rounded-2xl ${tip.bg} shrink-0`}>
              <tip.icon className={tip.color} size={28} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{tip.title}</h4>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">{tip.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-2/3">
            <h3 className="text-3xl font-black mb-4 tracking-tight">
              {lang === 'en' ? "Need Professional Help?" : "ต้องการความช่วยเหลือจากมืออาชีพ?"}
            </h3>
            <p className="text-slate-400 mb-8 font-medium">
              {lang === 'en' ? "If your addiction is impacting your work or mental health severely, consider speaking with a digital wellness therapist." : "หากการเสพติดของคุณส่งผลกระทบต่องานหรือสุขภาพจิตอย่างรุนแรง ลองปรึกษากับนักบำบัดด้านสุขภาวะดิจิทัล"}
            </p>
            <button className="btn-premium bg-white text-slate-900 flex items-center space-x-2">
              <span>{lang === 'en' ? "Find Specialists" : "ค้นหาผู้เชี่ยวชาญ"}</span>
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 bg-blue-600/20 rounded-full flex items-center justify-center animate-pulse">
              <PhoneOff size={80} className="text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Education
