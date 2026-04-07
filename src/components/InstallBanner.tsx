import { useInstallPrompt } from '../hooks/useInstallPrompt'

export function InstallBanner() {
  const { showBanner, install, dismiss } = useInstallPrompt()

  if (!showBanner) return null

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔌</span>
        <p className="text-sm text-slate-200">
          <span className="font-semibold">PumpOrPlug</span> als App installieren
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-green-400"
          onClick={install}
        >
          Installieren
        </button>
        <button
          className="text-slate-500 hover:text-slate-300 text-lg leading-none"
          onClick={dismiss}
          aria-label="Schließen"
        >
          ×
        </button>
      </div>
    </div>
  )
}
