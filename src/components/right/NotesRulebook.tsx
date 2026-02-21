/** UI개발정의서 §6.1 Tab3 Notes / Rulebook – 시스템정의서 Rule Review UI 연동 */
export function NotesRulebook() {
  return (
    <div className="notes-rulebook">
      <p className="muted">Notes 및 Rulebook. Rule 후보 승인/수정/폐기 UI 연동.</p>
      <ul>
        <li>Rule Review: 원문 텍스트 ↔ Rule DSL 변환 결과</li>
        <li>승인 / 수정 / 폐기 / 우선순위 조정</li>
      </ul>
    </div>
  )
}
