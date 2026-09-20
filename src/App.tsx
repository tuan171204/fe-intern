import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom"

import Footer from "./components/footer"
import Header from "./components/header"
import DashboardLayout from "./components/layout/DashboardLayout"
import Home from "./pages/home"
import Leaderboard from "./pages/leaderboard"
import TokenCreator from "./pages/token-creator"
import TokenList from "./pages/token-list"
import NftCreator from "./pages/nft-creator"
import NftList from "./pages/nft-list"

const Layout = () => (
  <div className="flex min-h-svh flex-col bg-background text-foreground">
    <Header isConnected={false} />
    <main className="flex flex-1 flex-col">
      <Outlet />
    </main>
    <Footer />
  </div>
)

const ComingSoon = () => (
  <div className="py-24 text-center text-sm text-muted-foreground">Coming soon</div>
)

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      {/* Trạng thái đã đăng nhập (giả lập): header mới + sidebar thay footer */}
      <Route element={<DashboardLayout />}>
        <Route path="token/create" element={<TokenCreator />} />
        <Route path="token/list" element={<TokenList />} />
        <Route path="nft/create" element={<NftCreator />} />
        <Route path="nft/list" element={<NftList />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App