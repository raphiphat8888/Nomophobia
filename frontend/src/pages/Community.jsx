import { Users } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Community = () => {
  const { lang } = useLanguage()

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-up">
      <div className="p-8 bg-blue-50 rounded-full">
        <Users size={64} className="text-blue-600" />
      </div>
      <h2 className="text-3xl font-black text-slate-800">
        {lang === 'en' ? 'Coming Soon' : 'เร็วๆ นี้'}
      </h2>
      <p className="text-slate-400 max-w-md font-medium">
        {lang === 'en' 
          ? 'We are currently aggregating anonymous data to build the global digital health benchmark comparison tool.' 
          : 'เรากำลังรวบรวมข้อมูลแบบไม่ระบุตัวตนเพื่อสร้างเครื่องมือเปรียบเทียบมาตรฐานสุขภาพดิจิทัลระดับโลก'}
      </p>
      <div className="flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}

export default Community
