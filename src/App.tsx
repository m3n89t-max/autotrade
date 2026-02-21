import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { TopBar } from '@/components/TopBar'
import { LeftSidebar } from '@/components/LeftSidebar'
import { ChartPanel } from '@/components/ChartPanel'
import { RightDock } from '@/components/RightDock'
import { BottomPanel } from '@/components/BottomPanel'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <TopBar />
      <PanelGroup direction="vertical" className="main-vertical">
        <Panel defaultSize={72} minSize={50}>
          <PanelGroup direction="horizontal" className="main-area">
            <Panel defaultSize={18} minSize={12} maxSize={28}>
              <LeftSidebar />
            </Panel>
            <PanelResizeHandle className="resize-handle" />
            <Panel defaultSize={56} minSize={30}>
              <ChartPanel />
            </Panel>
            <PanelResizeHandle className="resize-handle" />
            <Panel defaultSize={26} minSize={18} maxSize={40}>
              <RightDock />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className="resize-handle horizontal" />
        <Panel defaultSize={28} minSize={15} maxSize={45}>
          <BottomPanel />
        </Panel>
      </PanelGroup>
    </div>
  )
}
