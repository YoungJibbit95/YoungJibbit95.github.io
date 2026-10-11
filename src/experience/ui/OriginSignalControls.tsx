import { useOriginSignal } from '../../store/originSignalStore'
import { signalResponse } from '../worlds/originModel'

export function OriginSignalControls() {
  const step = useOriginSignal((state) => state.step)
  const send = useOriginSignal((state) => state.send)
  const reset = useOriginSignal((state) => state.reset)
  const response = signalResponse(step)
  return (
    <div
      className="atlas-v3__signal"
      data-testid="origin-signal"
      data-step={step}
      data-reached={response.reached.join(',')}
      data-edges={response.edges.join(',')}
    >
      <p aria-live="polite" aria-atomic="true">
        {response.message}
      </p>
      <div className="atlas-v3__signal-actions">
        <button className="atlas-v3__send" type="button" onClick={send}>
          {response.action} <span aria-hidden="true">↗</span>
        </button>
        <button
          type="button"
          className="atlas-v3__reset"
          disabled={step === 0}
          onClick={reset}
          aria-label="Signal zurücksetzen"
        >
          ↺
        </button>
      </div>
      <span className="atlas-v3__metaphor">Eine kleine Metapher für das Anfangen.</span>
    </div>
  )
}
