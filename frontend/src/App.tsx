import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import SurahListPage from './pages/SurahListPage'
import SurahPage from './pages/SurahPage'
import SearchPage from './pages/SearchPage'

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SurahListPage />} />
          <Route path="/surah/:id" element={<SurahPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}