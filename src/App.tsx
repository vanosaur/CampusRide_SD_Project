import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { NotificationProvider } from './context/NotificationContext'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import OTPVerify from './pages/OTPVerify'
import Home from './pages/Home'
import CreateRide from './pages/CreateRide'
import RideDetail from './pages/RideDetail'
import MyRides from './pages/MyRides'
import Profile from './pages/Profile'

import ProtectedRoute from './components/layout/ProtectedRoute'
import Navbar from './components/layout/Navbar'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Navbar />
              <main className="flex-1 flex flex-col">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-otp" element={<OTPVerify />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/create-ride" element={<CreateRide />} />
                    <Route path="/rides/:id" element={<RideDetail />} />
                    <Route path="/my-rides" element={<MyRides />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
