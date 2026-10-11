import { useEffect, type MouseEventHandler } from 'react'
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { useOriginSignal } from '../../store/originSignalStore'
import { originLandmarks, signalResponse } from '../worlds/originModel'
import { bindOriginJourneyClock } from '../OriginJourneyClock'

export function OriginSignalControls({
  onFocus,
  onTravel,
  travelHref,
}: {
  onFocus: (id: string) => void
  onTravel: MouseEventHandler<HTMLAnchorElement>
  travelHref: string
}) {
  const step = useOriginSignal((state) => state.step)
  const playback = useOriginSignal((state) => state.playback)
  const send = useOriginSignal((state) => state.send)
  const reset = useOriginSignal((state) => state.reset)
  const response = signalResponse(step)
  useEffect(() => {
    const unbind = bindOriginJourneyClock()
    const pauseWhenHidden = () => {
      if (document.hidden) useOriginSignal.getState().pause()
    }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => {
      useOriginSignal.getState().pause()
      unbind()
      document.removeEventListener('visibilitychange', pauseWhenHidden)
    }
  }, [])
  return (
    <div
      className="atlas-v3__signal"
      data-testid="origin-signal"
      data-step={step}
      data-playback={playback}
      data-reached={response.reached.join(',')}
      data-edges={response.edges.join(',')}
    >
      <p aria-live="polite" aria-atomic="true">
        {playback === 'paused' ? 'Pausiert. ' : ''}
        {response.message}
      </p>
      <div className="atlas-v3__journey-stops" role="group" aria-label="Signalweg erkunden">
        {originLandmarks.map((landmark) => (
          <button
            type="button"
            key={landmark.id}
            onClick={() => onFocus(landmark.id)}
            data-reached={response.reached.includes(landmark.id)}
            aria-label={landmark.title.replace(/^(Das|Die|Der) /, '') + ' ansehen'}
          >
            {landmark.title.replace(/^(Das|Die|Der) /, '')}
          </button>
        ))}
      </div>
      <div className="atlas-v3__signal-actions">
        <button
          className="atlas-v3__send"
          type="button"
          onClick={send}
          title="Einzelschritt: nächsten Abschnitt auslösen"
        >
          {response.action} <SkipForward size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="atlas-v3__reset"
          disabled={step === 0}
          onClick={reset}
          aria-label="Signal zurücksetzen"
        >
          <RotateCcw size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <div className="atlas-v3__playback" role="group" aria-label="Wiedergabe des Signals">
        <button
          type="button"
          onClick={() => {
            const state = useOriginSignal.getState()
            if (state.playback === 'playing') state.pause()
            else state.play()
          }}
        >
          {playback === 'playing' ? (
            <Pause size={14} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Play size={14} strokeWidth={1.5} aria-hidden="true" />
          )}
          {playback === 'playing' ? 'Pause' : playback === 'paused' ? 'Fortsetzen' : 'Abspielen'}
        </button>
        <button
          type="button"
          disabled={step === 0}
          onClick={() => useOriginSignal.getState().replay()}
        >
          Wiederholen
        </button>
        {response.portal ? (
          <a href={travelHref} onClick={onTravel}>
            Zur Sternwarte ↗
          </a>
        ) : null}
      </div>
      <span className="atlas-v3__metaphor">Eine kleine Metapher für das Anfangen.</span>
    </div>
  )
}
