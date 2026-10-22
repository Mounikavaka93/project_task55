import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { GuestOnly, RequireAuth } from './components/routing/guards'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MailProvider } from './context/MailContext'
import { ThemeProvider } from './context/ThemeContext'
import ComposePage from './pages/ComposePage'
import ForgotPassword from './pages/ForgotPassword'
import Mailbox from './pages/Mailbox'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

function MailGate() {
  const { user } = useAuth()
  return (
    <MailProvider key={user?.id ?? 'signed-out'}>
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/inbox" replace />} />
            <Route path="/compose" element={<ComposePage />} />
            <Route path="/:folder/:emailId?" element={<Mailbox />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MailProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MailGate />
      </AuthProvider>
    </ThemeProvider>
  )
}
