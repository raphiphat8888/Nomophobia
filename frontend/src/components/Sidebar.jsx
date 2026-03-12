import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  Users,
  Settings,
  PhoneOff
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `nav-link w-full ${isActive ? 'nav-link-active' : ''}`
    }
  >
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </NavLink>
)

const Sidebar = () => {
  const { lang } = useLanguage()

  return (
    <aside className="hidden lg:flex flex-col w-72 sidebar-glass p-6 shrink-0 transition-all">
      <div className="flex items-center space-x-3 text-white mb-12 p-2">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
          <PhoneOff size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tighter">NOMO-PHOBE</h1>
          <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest text-blue-400">
            {lang === 'en' ? 'Analysis Suite' : 'ระบบวิเคราะห์'}
          </p>
        </div>
      </div>

      <div className="space-y-3 flex-grow">
        <SidebarLink to="/" icon={LayoutDashboard} label={lang === 'en' ? "Admin Dashboard" : "หน้าหลักแดชบอร์ด"} />
        <SidebarLink to="/assessment" icon={ClipboardCheck} label={lang === 'en' ? "Clinical Assessment" : "แบบประเมินคลินิก"} />
        <SidebarLink to="/education" icon={BookOpen} label={lang === 'en' ? "Wellness Education" : "คลังความรู้สุขภาพ"} />
        <SidebarLink to="/community" icon={Users} label={lang === 'en' ? "Comparison Hub" : "ศูนย์เปรียบเทียบข้อมูล"} />
      </div>


    </aside>
  )
}

export default Sidebar
