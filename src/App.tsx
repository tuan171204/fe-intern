import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom"

import Footer from "./components/footer"
import Header from "./components/header"
import Home from "./pages/home"

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
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App