import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"

import Footer from "./components/footer"
import Header from "./components/header"
import DashboardLayout from "./components/layout/DashboardLayout"
import GuestRoute from "./components/routing/GuestRoute"
import ProtectedRoute from "./components/routing/ProtectedRoute"
import ConnectPage from "./pages/connect"
import Leaderboard from "./pages/leaderboard"
import TokenCreator from "./pages/token-creator"
import TokenList from "./pages/token-list"
import NftCreator from "./pages/nft-creator"
import NftList from "./pages/nft-list"
import Profile from "./pages/profile"
import { AuthProvider, useAuth } from "./store/AuthContext"

const Layout = () => {
  const { isLogged, user } = useAuth()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header isConnected={isLogged} address={user?.address} />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

const ComingSoon = () => (
  <div className="py-24 text-center text-sm text-muted-foreground">Coming soon</div>
)

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Chưa đăng nhập: trang Connect. Đã đăng nhập sẽ tự động bị đẩy sang /dashboard */}
        <Route element={<GuestRoute />}>
          <Route element={<Layout />}>
            <Route index element={<ConnectPage />} />
          </Route>
        </Route>

        {/* Đã đăng nhập: header mới + sidebar thay footer. Chưa đăng nhập sẽ bị đẩy về trang chủ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Leaderboard />} />
            <Route path="token/create" element={<TokenCreator />} />
            <Route path="token/list" element={<TokenList />} />
            <Route path="nft/create" element={<NftCreator />} />
            <Route path="nft/list" element={<NftList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)

export default App