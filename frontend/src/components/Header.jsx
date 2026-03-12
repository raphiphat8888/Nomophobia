import { useState, useEffect, useRef } from 'react'
import { Search, Bell, Globe, User, Book, Layout } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { searchIndex } from '../data/searchIndex'

const Header = () => {
  const { lang, toggleLang } = useLanguage()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setQuery(val)
    
    if (val.trim().length > 0) {
      const allItems = searchIndex(lang)
      const filtered = allItems.filter(item => 
        item.name.toLowerCase().includes(val.toLowerCase()) ||
        item.keywords.some(k => k.toLowerCase().includes(val.toLowerCase()))
      ).slice(0, 5)
      setResults(filtered)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  const handleSelect = (item) => {
    setQuery('')
    setIsOpen(false)
    if (item.target) {
      navigate(item.path, { state: { scrollTo: item.target } })
    } else {
      navigate(item.path)
    }
  }

  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-white/50 backdrop-blur-sm border-b border-slate-100 shrink-0 relative z-50">
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center bg-slate-100 rounded-2xl px-3 py-2 w-full max-w-[160px] sm:max-w-96 border border-slate-200/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            value={query}
            onChange={handleSearch}
            onFocus={() => query && setIsOpen(true)}
            placeholder={lang === 'en' ? "Search..." : "ค้นหา..."} 
            className="bg-transparent border-none outline-none text-xs sm:text-sm font-medium w-full" 
          />
        </div>

        {/* Search Results Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group"
                >
                  <div className={`p-2 rounded-lg ${item.type === 'expert' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                    {item.type === 'expert' ? <User size={16} /> : item.id.includes('assessment') ? <Book size={16} /> : <Layout size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6">
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
