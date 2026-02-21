/** UI개발정의서 §7 Bottom Panel: Order Entry, Positions, Logs */
import { useState } from 'react'
import { ClipboardList, TrendingUp, FileText } from 'lucide-react'
import { OrderEntry } from '@/components/bottom/OrderEntry'
import { Positions } from '@/components/bottom/Positions'
import { Logs } from '@/components/bottom/Logs'
import './BottomPanel.css'

type BottomTab = 'order' | 'positions' | 'logs'

export function BottomPanel() {
  const [tab, setTab] = useState<BottomTab>('order')

  const tabs: { id: BottomTab; label: string; icon: typeof ClipboardList }[] = [
    { id: 'order', label: 'Order Entry', icon: ClipboardList },
    { id: 'positions', label: 'Positions', icon: TrendingUp },
    { id: 'logs', label: 'Logs', icon: FileText },
  ]

  return (
    <div className="bottom-panel">
      <div className="bottom-panel-tabs">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="bottom-panel-content">
        {tab === 'order' && <OrderEntry />}
        {tab === 'positions' && <Positions />}
        {tab === 'logs' && <Logs />}
      </div>
    </div>
  )
}
