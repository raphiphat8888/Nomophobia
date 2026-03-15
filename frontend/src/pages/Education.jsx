import {
  Clock,
  Bell,
  ShieldCheck,
  Users,
  PhoneOff,
  ChevronRight,
  CheckCircle,
  Activity,
  AlertTriangle,
  AlertCircle,
  HeartPulse,
  Flame,
  Zap,
  TrendingDown,
  TrendingUp,
  Brain,
  Shield
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

/* ─── Severity config ──────────────────────────────────────────────────── */
const SEVERITY = [
  {
    score: "< 5.0",
    icon: CheckCircle,
    title_en: "Normal", title_th: "ปกติ",
    desc_en: "Excellent balance. Maintain your current digital lifestyle.",
    desc_th: "สมดุลดีมาก รักษาพฤติกรรมแบบนี้ต่อไป",
    danger: 0,
    accent: "#16a34a",
    bg: "linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)",
    bar: "bg-emerald-500",
    label: "SAFE",
    textColor: "#14532d",
    descColor: "#166534",
  },
  {
    score: "5.0–7.9",
    icon: Activity,
    title_en: "Moderate", title_th: "ปานกลาง",
    desc_en: "You are starting to rely on your device more than necessary.",
    desc_th: "เริ่มพึ่งพามือถือมากขึ้น ควรควบคุมเวลา",
    danger: 40,
    accent: "#d97706",
    bg: "linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)",
    bar: "bg-amber-500",
    label: "CAUTION",
    textColor: "#78350f",
    descColor: "#92400e",
  },
  {
    score: "8.0–8.9",
    icon: AlertTriangle,
    title_en: "Near Severe", title_th: "ใกล้รุนแรง",
    desc_en: "Strong intervention recommended. Try digital detox routines.",
    desc_th: "ควรเริ่มดีท็อกซ์ดิจิทัลอย่างจริงจัง",
    danger: 65,
    accent: "#ea580c",
    bg: "linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%)",
    bar: "bg-orange-500",
    label: "WARNING",
    textColor: "#7c2d12",
    descColor: "#9a3412",
  },
  {
    score: "9.0–9.9",
    icon: AlertCircle,
    title_en: "Severe Onset", title_th: "เริ่มรุนแรง",
    desc_en: "Immediate lifestyle adjustments required.",
    desc_th: "ต้องปรับพฤติกรรมอย่างเร่งด่วน",
    danger: 85,
    accent: "#dc2626",
    bg: "linear-gradient(135deg,#fff1f2 0%,#ffe4e6 100%)",
    bar: "bg-red-500",
    label: "DANGER",
    textColor: "#7f1d1d",
    descColor: "#991b1b",
  },
  {
    score: "10",
    icon: HeartPulse,
    title_en: "Critical", title_th: "วิกฤต",
    desc_en: "Consult a professional. This may affect mental health.",
    desc_th: "ควรปรึกษาผู้เชี่ยวชาญ อาจกระทบสุขภาพจิต",
    danger: 100,
    accent: "#b91c1c",
    bg: "linear-gradient(135deg,#fef2f2 0%,#fee2e2 100%)",
    bar: "bg-red-700",
    label: "CRITICAL",
    textColor: "#450a0a",
    descColor: "#7f1d1d",
  },
]

/* ─── Recovery tips ────────────────────────────────────────────────────── */
const TIPS = [
  {
    icon: Clock,
    title_en: "Digital Fasting", title_th: "พักจากหน้าจอก่อนนอน",
    desc_en: "Avoid phone 2 hrs before sleep", desc_th: "วางมือถือให้ได้อย่างน้อย 2 ชั่วโมงก่อนนอน",
    step: "01",
    timeline_en: "Start Here", timeline_th: "เริ่มวันนี้",
  },
  {
    icon: Bell,
    title_en: "Notification Cleanse", title_th: "จัดการการแจ้งเตือน",
    desc_en: "Turn off non-essential alerts", desc_th: "ปิดเสียงแจ้งเตือนที่ไม่จำเป็นออกให้หมด",
    step: "02",
    timeline_en: "Day 2", timeline_th: "วันที่ 2",
  },
  {
    icon: ShieldCheck,
    title_en: "Phone-Free Zones", title_th: "พื้นที่ปลอดมือถือ",
    desc_en: "No phone at the dining table", desc_th: "ห้ามนำมือถือขึ้นโต๊ะอาหารโดยเด็ดขาด",
    step: "03",
    timeline_en: "Week 1", timeline_th: "สัปดาห์แรก",
  },
  {
    icon: Users,
    title_en: "People Over Phones", title_th: "คนสำคัญกว่าจอ",
    desc_en: "Prioritize real conversations", desc_th: "หันมาคุยกับคนตรงหน้าแทนการเลื่อนฟีด",
    step: "04",
    timeline_en: "Ongoing", timeline_th: "ทำทุกวัน",
  },
]

/* ─── Pulse ring SVG ───────────────────────────────────────────────────── */
const PulseRing = ({ color }) => (
  <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 opacity-20" aria-hidden>
    {[30, 40, 50].map((r, i) => (
      <circle
        key={i}
        cx="50" cy="50" r={r}
        fill="none"
        stroke={color}
        strokeWidth="1"
        style={{ animation: `ping ${1.2 + i * 0.4}s ease-out infinite`, animationDelay: `${i * 0.3}s` }}
      />
    ))}
  </svg>
)

/* ─── Danger bar ───────────────────────────────────────────────────────── */
const DangerBar = ({ pct, barClass }) => (
  <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden mt-4">
    <motion.div
      className={`h-full rounded-full ${barClass}`}
      initial={{ width: 0 }}
      whileInView={{ width: `${pct}%` }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    />
  </div>
)

/* ─── Main component ───────────────────────────────────────────────────── */
const Education = () => {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=Sarabun:wght@400;500;700&display=swap');

        .edu-root { font-family: 'DM Sans', 'Sarabun', sans-serif; }
        .display-font { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; }
        .thai-body { font-family: 'Sarabun', sans-serif; }

        @keyframes ping {
          0%   { transform: scale(0.8); opacity: 0.8; }
          80%  { transform: scale(1.6); opacity: 0;   }
          100% { transform: scale(1.6); opacity: 0;   }
        }
        @keyframes flicker {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.6; }
        }
        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        .flicker { animation: flicker 2.4s ease-in-out infinite; }

        /* scan-line overlay */
        .scanlines::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.06) 2px,
            rgba(0,0,0,0.06) 4px
          );
          pointer-events: none;
          border-radius: inherit;
        }
      `}</style>

      <div className="edu-root space-y-20 pb-24 bg-white min-h-screen px-4 md:px-8">

        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <div ref={heroRef} className="relative overflow-hidden rounded-[32px] scanlines" style={{ minHeight: 420 }}>
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0"
          >
            {/* deep red hazard gradient */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 30%, #991b1b 0%, #7f1d1d 40%, #450a0a 100%)"
            }} />
            {/* grid overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "linear-gradient(rgba(255,80,80,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,80,80,0.3) 1px,transparent 1px)",
              backgroundSize: "40px 40px"
            }} />
          </motion.div>

          <div className="relative z-10 p-12 md:p-16 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-block bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold tracking-widest px-3 py-1 rounded-full mb-6 uppercase flicker">
                {lang === 'en' ? '⚠ Nomophobia Risk Assessment' : '⚠ การประเมินความเสี่ยงโนโมโฟเบีย'}
              </div>

              <h1 className="display-font text-6xl md:text-8xl text-white leading-none mb-4">
                {lang === 'en' ? (
                  <>DIGITAL<br /><span style={{ color: "#ef4444" }}>HEALTH</span><br />EDUCATION</>
                ) : (
                  <>สุขภาวะ<br /><span style={{ color: "#ef4444" }}>ดิจิทัล</span><br />เรียนรู้</>
                )}
              </h1>

              <p className="text-white/50 text-base leading-relaxed max-w-md mt-4">
                {lang === 'en'
                  ? "Understand your nomophobia severity level and discover scientifically guided recovery strategies."
                  : "ทำความเข้าใจระดับโนโมโฟเบียของคุณ พร้อมแนวทางฟื้นฟูที่อิงงานวิจัย"}
              </p>
            </div>

            {/* Skull-phone icon cluster */}
            <div className="relative w-52 h-52 shrink-0">
              <div className="absolute inset-0 rounded-full" style={{
                background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)"
              }} />
              <PulseRing color="#ef4444" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PhoneOff size={72} className="text-red-400 flicker" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* ── SEVERITY: DANGER SPECTRUM ──────────────────────────────────── */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Flame size={22} className="text-red-500" />
            <h2 className="display-font text-4xl text-slate-900 tracking-wider">
              {lang === 'en' ? 'DANGER SPECTRUM' : 'ระดับความเสี่ยง'}
            </h2>
          </div>

          {/* Horizontal risk gradient legend */}
          <div className="relative h-3 rounded-full overflow-hidden" style={{
            background: "linear-gradient(to right, #22c55e, #f59e0b, #f97316, #ef4444, #991b1b)"
          }}>
            <div className="absolute inset-0 flex">
              {["SAFE", "CAUTION", "WARNING", "DANGER", "CRITICAL"].map((l, i) => (
                <div key={l} className="flex-1 border-r border-black/20 last:border-0" />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-2">
            {(lang === 'en'
              ? ["Safe", "Caution", "Warning", "Danger", "Critical"]
              : ["ปลอดภัย", "ระวัง", "เตือน", "อันตราย", "วิกฤต"]
            ).map(l => (
              <span key={l}>{l}</span>
            ))}
          </div>

          {/* Cards — dark, each uniquely colored */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {SEVERITY.map((lvl, i) => {
              const Icon = lvl.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="relative overflow-hidden rounded-2xl p-6 scanlines cursor-default"
                  style={{ background: lvl.bg, border: `1px solid ${lvl.accent}30` }}
                >
                  {/* corner glow */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-40"
                    style={{ background: lvl.accent }} />

                  <div className="relative z-10">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded"
                        style={{ background: `${lvl.accent}25`, color: lvl.accent, border: `1px solid ${lvl.accent}40` }}>
                        {lvl.label}
                      </span>
                      <Icon size={22} style={{ color: lvl.accent }} strokeWidth={i >= 3 ? 2.5 : 1.8} />
                    </div>

                    {/* Score */}
                    <div className="display-font text-5xl leading-none mb-1" style={{ color: lvl.textColor }}>
                      {lvl.score}
                    </div>

                    <h3 className="font-bold text-lg mb-2" style={{ color: lvl.textColor }}>
                      {lang === 'en' ? lvl.title_en : lvl.title_th}
                    </h3>

                    <p className="text-sm leading-relaxed" style={{ color: lvl.descColor }}>
                      {lang === 'en' ? lvl.desc_en : lvl.desc_th}
                    </p>

                    {/* Danger bar */}
                    <DangerBar pct={lvl.danger} barClass={lvl.bar} />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px]" style={{ color: lvl.descColor }}>{lang === 'en' ? 'Risk Level' : 'ระดับความเสี่ยง'}</span>
                      <span className="text-[10px] font-bold" style={{ color: lvl.accent }}>
                        {lvl.danger}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ── IMPACT PANEL: what happens to you ──────────────────────────── */}
        <section className="relative overflow-hidden rounded-[32px] p-10 md:p-14 scanlines"
          style={{ background: "linear-gradient(135deg,#fff7ed 0%,#ffedd5 50%,#fef2f2 100%)", border: "1px solid rgba(251,146,60,0.25)" }}>

          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "repeating-linear-gradient(45deg, #f97316 0, #f97316 1px, transparent 0, transparent 50%)",
            backgroundSize: "8px 8px"
          }} />

          <div className="relative z-10 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Zap size={28} className="text-orange-500 mb-4" />
              <h2 className="display-font text-4xl text-slate-900 leading-tight mb-3">
                {lang === 'en' ? <>{`WHAT'S AT`}<br /><span className="text-orange-500">STAKE</span></> : <>ผลกระทบ<br /><span className="text-orange-500">ที่ต้องรู้</span></>}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                {lang === 'en'
                  ? 'Chronic nomophobia triggers measurable neurological and social damage over time.'
                  : 'โนโมโฟเบียที่สะสมนานวันส่งผลเสียต่อสมองและความสัมพันธ์อย่างชัดเจน'}
              </p>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {(lang === 'en' ? [
                { icon: Brain, label: "Mental Load", stat: "↑ 73%", desc: "Cognitive overload from constant pings" },
                { icon: TrendingDown, label: "Sleep Quality", stat: "↓ 40%", desc: "Disrupted melatonin from blue light" },
                { icon: Users, label: "Social Bonds", stat: "↓ 55%", desc: "Face-to-face interaction degraded" },
                { icon: HeartPulse, label: "Anxiety Index", stat: "↑ 2.4×", desc: "Separation anxiety when phone is away" },
              ] : [
                { icon: Brain, label: "ภาระสมอง", stat: "↑ 73%", desc: "รับข้อมูลเกินจากเสียงแจ้งเตือนตลอดวัน" },
                { icon: TrendingDown, label: "คุณภาพการนอนหลับ", stat: "↓ 40%", desc: "แสงสีฟ้าจากจอรบกวนการหลับลึก" },
                { icon: Users, label: "ความสัมพันธ์จริง", stat: "↓ 55%", desc: "เวลาพูดคุยต่อหน้ากันลดลงชัดเจน" },
                { icon: HeartPulse, label: "ความวิตกกังวล", stat: "↑ 2.4×", desc: "เครียดทุกครั้งที่ต้องวางมือถือ" },
              ]).map(({ icon: Icon, label, stat, desc }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/70 border border-orange-200 rounded-xl p-5"
                >
                  <Icon size={18} className="text-orange-500 mb-2" />
                  <div className="display-font text-3xl text-orange-600 mb-1">{stat}</div>
                  <div className="text-slate-700 text-sm font-semibold">{label}</div>
                  <div className="text-slate-400 text-xs mt-1 leading-snug">{desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RECOVERY PATH ──────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <TrendingUp size={22} className="text-emerald-500" />
            <h2 className="display-font text-4xl text-slate-900 tracking-wider">
              {lang === 'en' ? 'RECOVERY PATH' : 'เส้นทางการฟื้นฟู'}
            </h2>
          </div>

          {/* Timeline connector */}
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-amber-500 to-emerald-500 opacity-30" />

            <div className="space-y-5">
              {TIPS.map((tip, i) => {
                const Icon = tip.icon
                const lineColor = ["#ef4444", "#f59e0b", "#22c55e", "#22c55e"][i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 pl-4"
                  >
                    {/* step dot */}
                    <div className="relative shrink-0 z-10">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 text-[10px] font-black"
                        style={{ borderColor: lineColor, background: `${lineColor}18`, color: lineColor }}>
                        {tip.step}
                      </div>
                    </div>

                    {/* card */}
                    <div className="flex-1 flex items-center gap-5 p-6 rounded-2xl transition-all duration-200 hover:scale-[1.02] cursor-default"
                      style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.07)" }}>
                      <div className="p-3 rounded-xl shrink-0" style={{ background: `${lineColor}15` }}>
                        <Icon size={22} style={{ color: lineColor }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{lang === 'en' ? tip.title_en : tip.title_th}</h4>
                        <p className="text-slate-400 text-sm">{lang === 'en' ? tip.desc_en : tip.desc_th}</p>
                      </div>

                      {/* Difficulty pill */}
                      <div className="ml-auto shrink-0 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full"
                        style={{ background: `${lineColor}15`, color: lineColor, border: `1px solid ${lineColor}30` }}>
                        {lang === 'en' ? tip.timeline_en : tip.timeline_th}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-[32px] p-12 md:p-16 scanlines"
          style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)", border: "1px solid rgba(99,102,241,0.3)" }}>

          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{ background: "#6366f1" }} />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ background: "#a855f7" }} />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
                <Shield size={14} />
                {lang === 'en' ? 'Expert Support' : 'ขอความช่วยเหลือจากผู้เชี่ยวชาญ'}
              </div>
              <h3 className="display-font text-5xl text-white mb-4">
                {lang === 'en'
                  ? <>{`YOU DON'T`}<br /><span className="text-indigo-400">HAVE TO</span><br />GO ALONE</>
                  : <>ไม่ต้อง<br /><span className="text-indigo-400">สู้</span><br />คนเดียว</>}
              </h3>
              <p className="text-white/40 mb-8 max-w-sm leading-relaxed">
                {lang === 'en'
                  ? 'Connect with digital wellness specialists and mental health communities who understand your journey.'
                  : 'พูดคุยกับผู้เชี่ยวชาญด้านสุขภาพดิจิทัลและชุมชนที่พร้อมช่วยเหลือคุณ'}
              </p>

              <button
                onClick={() => navigate('/community')}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 0 32px rgba(99,102,241,0.3)" }}
              >
                {lang === 'en' ? 'Explore Community' : 'สำรวจชุมชน'}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="shrink-0">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full opacity-30 blur-xl"
                  style={{ background: "#6366f1" }} />
                <div className="absolute inset-0 rounded-full border border-indigo-500/30 flex items-center justify-center backdrop-blur-md"
                  style={{ background: "rgba(99,102,241,0.1)" }}>
                  <PhoneOff size={60} className="text-indigo-300" strokeWidth={1.2} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Education