import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { Award, Brain, Mail, Instagram } from 'lucide-react'

const ExpertCard = ({ name, role, title, image, bio_en, bio_th, delay, lang, instagram }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card flex flex-col md:flex-row gap-8 p-8 overflow-hidden group border border-slate-100/50 hover:border-blue-500/30 transition-all duration-300 w-full"
    style={{ maxWidth: '800px' }}
  >
    <div className="w-full md:w-48 xl:w-56 shrink-0 aspect-square rounded-[2rem] overflow-hidden relative shadow-lg shadow-blue-500/10">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 space-x-3">
        {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-pink-500 transition-colors"><Instagram size={18} /></a>}
      </div>
    </div>

    <div className="flex flex-col justify-center flex-grow text-left">
      <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-max mb-3">
        <Award size={14} />
        <span>{title}</span>
      </div>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{name}</h3>
      <p className="text-blue-500 font-bold mb-4">{role}</p>
      <p className="text-slate-500 leading-relaxed font-medium">
        {lang === 'en' ? bio_en : bio_th}
      </p>
    </div>
  </motion.div>
)

const Community = () => {
  const { lang } = useLanguage()

  const experts = [
    {
      name: lang === 'en' ? "Dr. Thanapol Khampimpit" : "นพ. ธนพล คำพิมพ์ปิด",
      title: "Nomophobia Specialist",
      role: lang === 'en' ? "Psychiatrist / Digital Health Expert" : "จิตแพทย์ / ผู้เชี่ยวชาญด้านสุขภาพดิจิทัล",
      image: "/experts/expert1.png",
      bio_en: "A leading medical expert specializing in the diagnosis and treatment of Nomophobia (No Mobile Phone Phobia). Committed to researching digital addiction and developing practical interventions to help individuals establish healthier relationships with technology.",
      bio_th: "แพทย์ผู้เชี่ยวชาญระดับแนวหน้าในการวินิจฉัยและรักษาภาวะโนโมโฟเบีย (Nomophobia) มุ่งมั่นวิจัยด้านการเสพติดสื่อดิจิทัลและพัฒนาแนวทางการรักษาที่ปฏิบัติได้จริง เพื่อช่วยให้ผู้คนสร้างความสัมพันธ์ที่ดีต่อสุขภาพกับเทคโนโลยี",
      instagram: "https://www.instagram.com/punz_tnp"
    },
    {
      name: lang === 'en' ? "Dr. Narusorn Ruangchot" : "ดร. นฤสรณ์ เรืองโชติ",
      title: "Data Analyst & Collector",
      role: lang === 'en' ? "Data Scientist / Data Analyst" : "นักเก็บรวบรวมและวิเคราะห์ข้อมูล",
      image: "/experts/expert2.png",
      bio_en: "Specializes in aggregating and analyzing behavioral and demographic data to identify Nomophobia patterns. Ensures data integrity and develops predictive models to accurately assess digital dependency risks.",
      bio_th: "ผู้รับผิดชอบหลักในการเก็บรวบรวมและวิเคราะห์ข้อมูลพฤติกรรมการใช้สมาร์ทโฟนของกลุ่มตัวอย่าง แปลงข้อมูลทางสถิติที่ซับซ้อนให้กลายเป็นข้อมูลเชิงลึก เพื่อนำไปใช้พัฒนาโมเดลทำนายความเสี่ยงได้อย่างแม่นยำ",
      instagram: "https://www.instagram.com/baimon.exe"
    },
    {
      name: lang === 'en' ? "Dr. Raphiphat Saenkla" : "ดร. รพีภัทร แสนกล้า",
      title: "Graph Analysis Expert",
      role: lang === 'en' ? "Visualization Specialist" : "ผู้เชี่ยวชาญด้านการวิเคราะห์กราฟ",
      image: "/experts/expert3.png",
      bio_en: "Specialist in analyzing and presenting data through deep-dive visualizations. Helps translate complex datasets into clear, actionable insights for better understanding of digital behavior.",
      bio_th: "ผู้เชี่ยวชาญด้านการวิเคราะห์และนำเสนอข้อมูลผ่านกราฟเชิงลึก ช่วยในการตีความชุดข้อมูลที่ซับซ้อนให้กลายเป็นข้อสรุปที่เข้าใจง่ายและจับต้องได้ เพื่อความเข้าใจที่ชัดเจนขึ้นเกี่ยวกับพฤติกรรมดิจิทัล",
      instagram: "https://www.instagram.com/t.takt.8888_/"
    },
    {
      name: lang === 'en' ? "Dr. Sirikasemkit Tiamtong" : "ดร. สิริเกษมกิจ เทียมทอง",
      title: "Clinical Wellness Specialist",
      role: lang === 'en' ? "Holistic Health Researcher" : "ผู้เชี่ยวชาญด้านสุขภาวะทางคลินิก",
      image: "/experts/expert4.png",
      bio_en: "Expert in holistic wellness and clinical intervention. Focuses on developing balanced digital lifestyle programs to promote psychological wellbeing and reduce technology-induced stress.",
      bio_th: "ผู้เชี่ยวชาญด้านสุขภาวะแบบองค์รวมและการบำบัดทางคลินิก มุ่งเน้นการพัฒนาโปรแกรมการใช้ชีวิตดิจิทัลอย่างสมดุล เพื่อส่งเสริมสุขภาพจิตและลดความเครียดที่เกิดจากการใช้เทคโนโลยี",
      instagram: "https://www.instagram.com/boat_sirikasamkit"
    },
    {
      name: lang === 'en' ? "Dr. Jiramet Berkban" : "นพ. จิรเมธ เบิกบาน",
      title: "Deputy Assistant Researcher",
      role: lang === 'en' ? "Clinical Support Specialist" : "รองผู้ช่วยนักวิจัย / แพทย์สนับสนุนคลินิก",
      image: "/experts/expert5.png",
      bio_en: "Provides essential clinical support and assists in coordinating research activities. Focuses on data quality assurance and patient-centric communication within the Nomophobia study.",
      bio_th: "ผู้ให้การสนับสนุนด้านคลินิกและช่วยประสานงานกิจกรรมการวิจัย มุ่งเน้นการตรวจสอบคุณภาพข้อมูลและการสื่อสารที่ยึดผู้ป่วยเป็นศูนย์กลางในการศึกษาภาวะโนโมโฟเบีย",
      instagram: "https://www.instagram.com/jb.first"
    },
    {
      name: lang === 'en' ? "Dr. Pasu Poeyrutai" : "ดร. พสุ เผยฤทัย",
      title: "Senior Strategic Advisor",
      role: lang === 'en' ? "Policy & Strategy Consultant" : "ที่ปรึกษาอาวุโสด้านกลยุทธ์และนโยบาย",
      image: "/experts/expert6.png",
      bio_en: "A visionary strategist providing high-level guidance for research direction and digital wellbeing policies. Oversees the long-term impact of the Nomophobia assessment framework on public health.",
      bio_th: "นักยุทธศาสตร์ผู้มีวิสัยทัศน์คอยให้คำแนะนำระดับสูงเกี่ยวกับทิศทางการวิจัยและนโยบายสุขภาวะทางดิจิทัล ดูแลผลกระทบในระยะยาวของกรอบการประเมินภาวะโนโมโฟเบียต่อสุขภาพสาธารณะ",
      instagram: "https://www.instagram.com/ik_pasu"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-up pb-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-2">
          <Brain size={16} />
          <span>{lang === 'en' ? 'Our Team' : 'ทีมงานของเรา'}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {lang === 'en' ? 'Meet The Experts' : 'คณะผู้เชี่ยวชาญของเรา'}
        </h2>
        <p className="text-slate-500 text-lg font-medium leading-relaxed">
          {lang === 'en'
            ? 'Behind the Nomophobia Analysis Suite is a dedicated team of researchers, psychologists, and data scientists committed to promoting digital wellbeing.'
            : 'เบื้องหลังระบบวิเคราะห์ Nomophobia คือทีมผู้วิจัย นักจิตวิทยา และนักวิทยาศาสตร์ข้อมูลที่มุ่งมั่นสร้างสรรค์และส่งเสริมสุขภาวะทางดิจิทัล'}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        {experts.map((expert, index) => (
          <ExpertCard
            key={index}
            {...expert}
            delay={index * 0.1}
            lang={lang}
          />
        ))}
      </div>

      <div className="mt-20 text-center">
        <div className="glass-card shadow-lg border border-indigo-100/50 inline-block p-10 md:px-20 mx-auto bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-[3rem]">
          <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
            {lang === 'en' ? 'Ready to collaborate?' : 'สนใจพัฒนาและวิจัยเพิ่มเติม?'}
          </h3>
          <p className="text-slate-500 font-medium mb-8 text-lg">
            {lang === 'en'
              ? 'We are open to academic and medical partnerships globally.'
              : 'เราเปิดรับความร่วมมือทางวิชาการและการแพทย์จากทุกหน่วยงานทั่วประเทศ'}
          </p>
          <a
            href="mailto:raphiphat.s@ku.th"
            className="btn-premium bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold inline-flex items-center space-x-3 hover:scale-105 transition-transform"
          >
            <Mail size={20} />
            <span>{lang === 'en' ? 'Contact Our Research Team' : 'ติดต่อทีมวิจัยของเรา'}</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Community
