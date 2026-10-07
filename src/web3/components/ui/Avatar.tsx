// components/ui/Avatar.tsx
// Avatar tạo từ địa chỉ ví: mỗi tài khoản có một cặp màu riêng nên dễ nhận ra khi đổi account.
const sizes = { sm: 'h-6 w-6', md: 'h-9 w-9', lg: 'h-12 w-12' } as const

export function Avatar({ address, size = 'md' }: { address: string; size?: keyof typeof sizes }) {
  const hue1 = parseInt(address.slice(2, 8), 16) % 360
  const hue2 = (parseInt(address.slice(8, 14), 16) % 360 + 40) % 360
  return (
    <span
      aria-hidden="true"
      className={`${sizes[size]} inline-block shrink-0 rounded-full ring-2 ring-white/70`}
      style={{ background: `linear-gradient(135deg, hsl(${hue1} 75% 58%), hsl(${hue2} 70% 45%))` }}
    />
  )
}
