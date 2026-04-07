import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { VehiclePage } from './pages/VehiclePage'
import { FuelPage } from './pages/FuelPage'
import { ResultPage } from './pages/ResultPage'
import { SettingsPage } from './pages/SettingsPage'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { InstallBanner } from './components/InstallBanner'

function Layout({ children }: { children: React.ReactNode }) {
  const online = useOnlineStatus()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <InstallBanner />
      {!online && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-center text-xs text-amber-300">
          ⚠️ Offline – App funktioniert mit gespeicherten Daten
        </div>
      )}
      <header className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-xl">🔌⛽</span>
          <span className="font-bold tracking-tight">PumpOrPlug</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `text-sm ${isActive ? 'text-green-400' : 'text-slate-400 hover:text-slate-200'}`
          }
        >
          ⚙️
        </NavLink>
      </header>
      <main className="mx-auto max-w-md px-4 py-6">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<VehiclePage />} />
          <Route path="/fuel" element={<FuelPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
