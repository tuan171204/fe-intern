import { useState } from 'react'
import { formatUnits, type Address } from 'viem'
import { useErc20Info } from '../hooks/useErc20Info'
import { useErc20Transfer } from '../hooks/useErc20Transfer'
import { formatDisplay } from '../lib/format'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Field } from './ui/Field'
import { Input } from './ui/Input'
import { Notice } from './ui/Notice'
import { TxStatus } from './ui/TxStatus'

interface Erc20CardProps {
  address: Address
  canTransact: boolean
}

export function Erc20Card({ address, canTransact }: Erc20CardProps) {
  const [tokenAddress, setTokenAddress] = useState('')

  const info = useErc20Info(tokenAddress, address)
  const transfer = useErc20Transfer({
    owner: address,
    token: info.validToken,
    decimals: info.decimals,
    balance: info.balance,
    refetchInfo: info.refetch,
    canTransact,
  })

  const { symbol, decimals, balance } = info
  const isTokenLoaded = symbol !== undefined && decimals !== undefined && balance !== undefined
  // Khóa form khi đang xử lý giao dịch hoặc sai mạng.
  const locked = transfer.isBusy || !canTransact

  return (
    <Card title="Chuyển ERC-20" subtitle="Nhập địa chỉ contract để xem số dư và chuyển token.">
      <Field
        label="Địa chỉ Token Contract"
        error={info.tokenError}
        hint={!tokenAddress ? 'Contract trên Sepolia' : undefined}
      >
        {(id) => (
          <Input
            id={id}
            placeholder="0x…"
            value={tokenAddress}
            invalid={Boolean(info.tokenError)}
            disabled={transfer.isBusy}
            onChange={(e) => {
              setTokenAddress(e.target.value.trim())
              // Đổi token -> xoá số lượng + kết quả giao dịch của token cũ.
              transfer.clear()
            }}
            spellCheck={false}
            autoComplete="off"
          />
        )}
      </Field>

      {info.isLoading && <div className="h-[72px] animate-pulse rounded-2xl bg-slate-100" />}

      {isTokenLoaded && (
        <>
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
              {symbol.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Số dư {symbol}</p>
              <p className="truncate text-xl font-semibold tabular-nums text-slate-900">
                {formatDisplay(balance, decimals)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Decimals</p>
              <p className="text-sm font-semibold tabular-nums text-slate-900">{decimals}</p>
            </div>
          </div>

          <Field label="Địa chỉ ví nhận" error={transfer.toError}>
            {(id) => (
              <Input
                id={id}
                placeholder="0x…"
                value={transfer.toAddress}
                invalid={Boolean(transfer.toError)}
                disabled={locked}
                onChange={(e) => transfer.setToAddress(e.target.value.trim())}
                spellCheck={false}
                autoComplete="off"
              />
            )}
          </Field>

          <Field label="Số lượng" error={transfer.amountError}>
            {(id) => (
              <Input
                id={id}
                placeholder="0.0"
                inputMode="decimal"
                value={transfer.amount}
                invalid={Boolean(transfer.amountError)}
                disabled={locked}
                onChange={(e) => transfer.setAmount(e.target.value)}
                suffix={
                  <>
                    <span className="text-xs font-semibold text-slate-400">{symbol}</span>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => transfer.setAmount(formatUnits(balance, decimals))}
                      className="cursor-pointer rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Max
                    </button>
                  </>
                }
              />
            )}
          </Field>

          {transfer.warnings.map((w) => (
            <Notice key={w} tone="warning">
              {w}
            </Notice>
          ))}

          {transfer.preflightError && <Notice tone="error">{transfer.preflightError}</Notice>}

          <Button fullWidth loading={transfer.isBusy} disabled={!transfer.canSubmit} onClick={transfer.transfer}>
            {transfer.isBusy ? 'Đang xử lý…' : 'Transfer Token'}
          </Button>

          <TxStatus tx={transfer.tx} />
        </>
      )}
    </Card>
  )
}