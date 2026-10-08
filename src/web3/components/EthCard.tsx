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
  // Khóa form khi đang xử lý giao dịch hoặc sai mạng.
  const locked = eth.isBusy || !canTransact

  return (
    <Card title="Chuyển ETH" subtitle="Gửi Sepolia ETH tới một địa chỉ ví khác.">
      <Field
        label="Địa chỉ ví nhận"
        error={eth.addressError}
        hint={eth.recipientHasCode ? 'Smart contract' : undefined}
      >
        {(id) => (
          <Input
            id={id}
            placeholder="0x…"
            value={eth.toAddress}
            invalid={Boolean(eth.addressError)}
            disabled={locked}
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
            disabled={locked}
            onChange={(e) => eth.setAmount(e.target.value)}
            suffix={<span className="text-xs font-semibold text-slate-400">ETH</span>}
          />
        )}
      </Field>

      {/* Tại mỗi thời điểm chỉ hiện tối đa một thông báo liên quan tới hành động hiện tại. */}
      {eth.showRecipientCheck && (
        <Notice tone="info" loading>
          Đang kiểm tra loại địa chỉ nhận…
        </Notice>
      )}
      {eth.warning && <Notice tone="warning">{eth.warning}</Notice>}
      {eth.preflightError && <Notice tone="error">{eth.preflightError}</Notice>}

      <Button fullWidth loading={eth.isBusy} disabled={!eth.canSubmit} onClick={eth.send}>
        {eth.isPreparing ? 'Đang kiểm tra…' : eth.isBusy ? 'Đang xử lý…' : 'Send ETH'}
      </Button>

      <TxStatus tx={eth.tx} />
    </Card>
  )
}