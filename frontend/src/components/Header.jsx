import { Search, Bell, Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Header = () => {
  const { lang, toggleLang } = useLanguage()

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm border-b border-slate-100 shrink-0">
      <div className="flex items-center bg-slate-100 rounded-2xl px-4 py-2 w-96 border border-slate-200/50">
        <Search size={18} className="text-slate-400 mr-2" />
        <input type="text" placeholder={lang === 'en' ? "Search research metrics..." : "ค้นหาข้อมูลงานวิจัย..."} className="bg-transparent border-none outline-none text-sm font-medium w-full" />
      </div>

      <div className="flex items-center space-x-6">
        {/* Language Switcher */}
        <button
          onClick={toggleLang}
          className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200/50 hover:bg-slate-200 transition-all font-bold text-xs"
        >
          <Globe size={16} className="text-blue-600" />
          <span className="text-slate-600">{lang === 'en' ? 'EN' : 'TH'}</span>
        </button>

      </div>
    </header>
  )
}

export default Header
