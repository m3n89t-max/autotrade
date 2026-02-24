import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { TopBar } from '@/components/TopBar'
import { LeftSidebar } from '@/components/LeftSidebar'
import { TradingViewChartPanel } from '@/components/TradingViewChartPanel'
import { RightDock } from '@/components/RightDock'
import { BottomPanel } from '@/components/BottomPanel'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <TopBar />
      <PanelGroup direction="vertical" className="main-vertical">
        <Panel defaultSize={78} minSize={50}>
          <PanelGroup direction="horizontal" className="main-area">
            <Panel defaultSize={17} minSize={12} maxSize={28}>
              <LeftSidebar />
            </Panel>
            <PanelResizeHandle className="resize-handle" />
            <Panel defaultSize={66} minSize={35}>
              <TradingViewChartPanel />
            </Panel>
            <PanelResizeHandle className="resize-handle" />
            <Panel defaultSize={17} minSize={18} maxSize={40}>
              <RightDock />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="resize-handle horizontal" />
        <Panel defaultSize={22} minSize={12} maxSize={40}>
          <BottomPanel />
        </Panel>
      </PanelGroup>
    </div>
  )
}
