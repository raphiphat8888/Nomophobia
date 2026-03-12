export const searchIndex = (lang) => [
  // Menus
  {
    id: 'menu-dashboard',
    type: 'menu',
    name: lang === 'en' ? 'Admin Dashboard' : 'หน้าหลักแดชบอร์ด',
    path: '/',
    keywords: ['dashboard', 'home', 'overview', 'หน้าหลัก', 'แดชบอร์ด', 'metrics', 'respondents', 'usage', 'checks', 'addiction', 'ตัวชี้วัด', 'ผู้เข้าร่วม', 'การใช้งาน', 'เสพติด', 'ความเสี่ยง']
  },
  {
    id: 'menu-assessment',
    type: 'menu',
    name: lang === 'en' ? 'Clinical Assessment' : 'แบบประเมินคลินิก',
    path: '/assessment',
    keywords: ['assessment', 'test', 'exam', 'แบบประเมิน', 'ทดสอบ']
  },
  {
    id: 'menu-education',
    type: 'menu',
    name: lang === 'en' ? 'Wellness Education' : 'คลังความรู้สุขภาพ',
    path: '/education',
    keywords: ['education', 'knowledge', 'wellness', 'คลังความรู้', 'สุขภาพ']
  },
  {
    id: 'menu-community',
    type: 'menu',
    name: lang === 'en' ? 'Meet the Experts' : 'รู้จักผู้เชี่ยวชาญ',
    path: '/community',
    keywords: ['experts', 'team', 'professor', 'community', 'ผู้เชี่ยวชาญ', 'ทีมงาน']
  },
  
  // Experts
  {
    id: 'expert-thanapol',
    type: 'expert',
    name: lang === 'en' ? "Dr. Thanapol Khampimpit" : "นพ. ธนพล คำพิมพ์ปิด",
    path: '/community',
    target: 'expert-thanapol',
    keywords: ['thanapol', 'khampimpit', 'ธนพล', 'คำพิมพ์ปิด', 'specialist']
  },
  {
    id: 'expert-narusorn',
    type: 'expert',
    name: lang === 'en' ? "Dr. Narusorn Ruangchot" : "ดร. นฤสรณ์ เรืองโชติ",
    path: '/community',
    target: 'expert-narusorn',
    keywords: ['narusorn', 'ruangchot', 'นฤสรณ์', 'เรืองโชติ', 'data']
  },
  {
    id: 'expert-raphiphat',
    type: 'expert',
    name: lang === 'en' ? "Dr. Raphiphat Saenkla" : "ดร. รพีภัทร แสนกล้า",
    path: '/community',
    target: 'expert-raphiphat',
    keywords: ['raphiphat', 'saenkla', 'รพีภัทร', 'แสนกล้า', 'graph', 'takt']
  },
  {
    id: 'expert-sirikasemkit',
    type: 'expert',
    name: lang === 'en' ? "Dr. Sirikasemkit Tiamtong" : "ดร. สิริเกษมกิจ เทียมทอง",
    path: '/community',
    target: 'expert-sirikasemkit',
    keywords: ['sirikasemkit', 'tiamtong', 'สิริเกษมกิจ', 'เทียมทอง', 'wellness', 'boat']
  },
  {
    id: 'expert-jiramet',
    type: 'expert',
    name: lang === 'en' ? "Dr. Jiramet Berkban" : "นพ. จิรเมธ เบิกบาน",
    path: '/community',
    target: 'expert-jiramet',
    keywords: ['jiramet', 'berkban', 'จิรเมธ', 'เบิกบาน', 'first']
  },
  {
    id: 'expert-pasu',
    type: 'expert',
    name: lang === 'en' ? "Dr. Pasu Poeyrutai" : "ดร. พสุ เผยฤทัย",
    path: '/community',
    target: 'expert-pasu',
    keywords: ['pasu', 'poeyrutai', 'พสุ', 'เผยฤทัย']
  }
]
