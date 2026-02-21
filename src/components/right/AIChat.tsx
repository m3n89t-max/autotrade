/** UI개발정의서 §6.2 AI Chat – Primary/Alternative/Invalidation/Entry Trigger/Risk 블록, /wave validate, /strategy draft, /risk check */
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

const TEMPLATE = `Primary Scenario:
Alternative Scenario:
Invalidation:
Entry Trigger:
Risk (SL / Position Size):`

export function AIChat() {
  const [input, setInput] = useState('')
  const { symbol } = useAppStore()

  const send = (cmd?: string) => {
    const text = cmd ?? input
    if (!text.trim()) return
    setInput('')
    // TODO: API 연동
    console.log('AI Chat:', text, symbol)
  }

  return (
    <div className="ai-chat">
      <div className="ai-chat-context">
        <span>차트: {symbol}</span>
      </div>
      <div className="ai-chat-output">
        <pre className="ai-template">{TEMPLATE}</pre>
        <p className="ai-hint">현재 차트 컨텍스트 자동 인식. 슬래시 명령: /wave validate, /strategy draft, /risk check</p>
      </div>
      <div className="ai-chat-shortcuts">
        <button type="button" onClick={() => send('/wave validate')}>/wave validate</button>
        <button type="button" onClick={() => send('/strategy draft')}>/strategy draft</button>
        <button type="button" onClick={() => send('/risk check')}>/risk check</button>
      </div>
      <div className="ai-chat-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="메시지 또는 /명령"
        />
        <button type="button" onClick={() => send()}>전송</button>
      </div>
    </div>
  )
}
