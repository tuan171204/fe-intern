import type { Address } from 'viem'
import { useEthTransfer } from '../hooks/useEthTransfer'
import { formatDisplay } from '../lib/format'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Field } from './ui/Field'
import { Input } from './ui/Input'
import { Notice } from './ui/Notice'
import { TxStatus } from './ui/TxStatus'

interface EthCardProps {
  address: Address
  canTransact: boolean
}

export function EthCard({ address, canTransact }: EthCardProps) {
  const eth = useEthTransfer(address, canTransact)
  const { balance } = eth

  return (
    <Card title="Chuyển ETH" subtitle="Gửi Sepolia ETH tới một địa chỉ ví khác.">
      <Field label="Địa chỉ ví nhận" error={eth.addressError}>
        {(id) => (
          <Input
            id={id}
            placeholder="0x…"
            value={eth.toAddress}
            invalid={Boolean(eth.addressError)}
            onChange={(e) => eth.setToAddress(e.target.value.trim())}
            spellCheck={false}
            autoComplete="off"
          />
        )}
      </Field>

      <Field
        label="Số lượng"
        error={eth.amountError}
        hint={balance ? `Khả dụng: ${formatDisplay(balance.value, balance.decimals)} ETH` : undefined}
      >
        {(id) => (
          <Input
            id={id}
            placeholder="0.01"
            inputMode="decimal"
            value={eth.amount}
            invalid={Boolean(eth.amountError)}
            onChange={(e) => eth.setAmount(e.target.value)}
            suffix={<span className="text-xs font-semibold text-slate-400">ETH</span>}
          />
        )}
      </Field>

      {eth.warnings.map((w) => (
        <Notice key={w} tone="warning">
          {w}
        </Notice>
      ))}

      <Button fullWidth loading={eth.isBusy} disabled={!eth.canSubmit} onClick={eth.send}>
        {eth.isBusy ? 'Đang xử lý…' : 'Send ETH'}
      </Button>

      <TxStatus tx={eth.tx} />
    </Card>
  )
}
