/** UI개발정의서 §6 Right Dock: Tab1 AI Chat, Tab2 US Economic Calendar, Tab3 Notes/Rulebook */
import { MessageCircle, Calendar, FileText } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { AIChat } from '@/components/right/AIChat'
import { EconCalendar } from '@/components/right/EconCalendar'
import { NotesRulebook } from '@/components/right/NotesRulebook'
import './RightDock.css'

const TABS = [
  { id: 'ai' as const, label: 'AI Chat', icon: MessageCircle },
  { id: 'econ' as const, label: 'US Economic', icon: Calendar },
  { id: 'notes' as const, label: 'Notes / Rulebook', icon: FileText },
] as const

export function RightDock() {
  const { ui, setActiveTab } = useAppStore()
  const { activeTab } = ui

  return (
    <aside className="right-dock">
      <div className="right-dock-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={activeTab === id ? 'active' : ''}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="right-dock-content">
        {activeTab === 'ai' && <AIChat />}
        {activeTab === 'econ' && <EconCalendar />}
        {activeTab === 'notes' && <NotesRulebook />}
      </div>
    </aside>
  )
}
