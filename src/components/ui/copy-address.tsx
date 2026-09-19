import * as React from "react"
import { Check, Copy } from "lucide-react"

import cn from "../../utils/cn"

/** 0x4aq1234...gfr6j5lda -> 0x4aq...j5lda */
export const shortenAddress = (address: string, head = 6, tail = 5) =>
  address.length <= head + tail + 3 ? address : `${address.slice(0, head)}...${address.slice(-tail)}`

export interface CopyAddressProps extends React.HTMLAttributes<HTMLSpanElement> {
  address: string
  /** Rút gọn địa chỉ (mặc định: true) */
  short?: boolean
}

/** Hiển thị địa chỉ ví/contract kèm icon copy (Token List, NFT List, Leaderboard) */
const CopyAddress = ({ address, short = true, className, ...props }: CopyAddressProps) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard bị chặn: bỏ qua */
    }
  }

  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] text-muted-foreground", className)} {...props}>
      <span title={address}>{short ? shortenAddress(address) : address}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy address"
        className="rounded p-0.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {copied ? <Check className="size-3 text-teal-600" /> : <Copy className="size-3" />}
      </button>
    </span>
  )
}

export { CopyAddress }
export default CopyAddress
