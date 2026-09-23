import * as React from "react"

import cn from "../../utils/cn"
import Icon from "./icon"

export const shortenAddress = (address: string, head = 6, tail = 5) =>
  address.length <= head + tail + 3 ? address : `${address.slice(0, head)}...${address.slice(-tail)}`

export interface CopyAddressProps extends React.HTMLAttributes<HTMLSpanElement> {
  address: string
  short?: boolean
  head?: number
  tail?: number
}

const CopyAddress = ({ address, short = true, head, tail, className, ...props }: CopyAddressProps) => {
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
      <span title={address}>{short ? shortenAddress(address, head, tail) : address}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy address"
        className="rounded p-0.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Icon name={copied ? "check" : "copy"} size="xs" className={copied ? "text-teal-600" : undefined} />
      </button>
    </span>
  )
}

export { CopyAddress }
export default CopyAddress