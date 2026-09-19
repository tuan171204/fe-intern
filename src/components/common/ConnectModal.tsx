import * as React from "react"

import { Avatar } from "../ui/avatar"
import { Button } from "../ui/button"
import { Dialog } from "../ui/dialog"
import { Input } from "../ui/input"
import { Tabs, type TabOption } from "../ui/tabs"

export interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

type ConnectTab = "wallet" | "account"

const TABS: TabOption<ConnectTab>[] = [
  { value: "wallet", label: "Connect Wallet" },
  { value: "account", label: "Sign In / Register" },
]

// Logo tạm bằng chữ viết tắt; thay bằng <img src="/wallets/xxx.svg" /> khi có asset thật
const WALLETS = [
  { name: "MetaMask", short: "MM", color: "bg-orange-100 text-orange-600" },
  { name: "Coinbase Wallet", short: "CB", color: "bg-blue-100 text-blue-600" },
  { name: "Phantom", short: "PH", color: "bg-violet-100 text-violet-600" },
]

const ConnectModal = ({ isOpen, onClose }: ConnectModalProps) => {
  const [tab, setTab] = React.useState<ConnectTab>("wallet")

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Welcome to ACW3">
      <div className="mb-5 flex justify-center">
        <Tabs options={TABS} value={tab} onChange={setTab} />
      </div>

      {tab === "wallet" ? (
        <ul className="flex flex-col gap-2">
          {WALLETS.map((wallet) => (
            <li key={wallet.name}>
              <Button variant="outline" className="h-12 w-full justify-start gap-3 rounded-lg">
                <Avatar fallback={wallet.short} size="md" className={wallet.color} />
                {wallet.name}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Email" type="email" placeholder="you@example.com" required />
          <Input label="Password" type="password" placeholder="••••••••" required />
          <Button type="submit" className="h-10 w-full rounded-full bg-teal-600 text-white hover:bg-teal-700">
            Submit
          </Button>
        </form>
      )}
    </Dialog>
  )
}

export { ConnectModal }
export default ConnectModal
