// Badge nhỏ ở header cho biết trạng thái mạng hiện tại.
interface NetworkPillProps {
  isConnected: boolean
  isWrongNetwork: boolean
}

export function NetworkPill({ isConnected, isWrongNetwork }: NetworkPillProps) {
  const { dot, text } = !isConnected
    ? { dot: 'bg-slate-300', text: 'Chưa kết nối' }
    : isWrongNetwork
      ? { dot: 'bg-amber-500', text: 'Sai mạng' }
      : { dot: 'bg-emerald-500', text: 'Sepolia' }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {text}
    </span>
  )
}
