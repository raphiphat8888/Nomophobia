import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  Users
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const MobileNav = () => {
  const { lang } = useLanguage()

  const links = [
    { to: "/", icon: LayoutDashboard, label: lang === 'en' ? "Dash" : "หน้าหลัก" },
    { to: "/assessment", icon: ClipboardCheck, label: lang === 'en' ? "Test" : "ประเมิน" },
    { to: "/education", icon: BookOpen, label: lang === 'en' ? "Learn" : "ความรู้" },
    { to: "/community", icon: Users, label: lang === 'en' ? "Experts" : "ผู้เชี่ยวชาญ" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/80 backdrop-blur-xl border-t border-slate-100 px-4 py-2 flex justify-around items-center z-50">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center space-y-1 p-2 transition-all duration-300 ${
              isActive ? 'text-blue-600 scale-110' : 'text-slate-400'
            }`
          }
        >
          <link.icon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{link.label}</span>
          {/* Active Dot */}
          <NavLink
            to={link.to}
            className={({ isActive }) =>
              `w-1 h-1 rounded-full bg-blue-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`
            }
          />
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNav
