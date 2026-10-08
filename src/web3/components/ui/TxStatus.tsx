// Hiển thị trạng thái giao dịch: Loading / Success / Revert / Timeout / Error (kèm link Etherscan).
import { EXPLORER_URL } from '../../constants/network'
import { getErrorMessage, shortenAddress } from '../../lib/format'
import type { TxState } from '../../types'
import { Icon } from './Icon'
import { Notice } from './Notice'

function ExplorerLink({ hash, label }: { hash: string; label?: string }) {
  return (
    <a
      href={`${EXPLORER_URL}/tx/${hash}`}
      target="_blank"
      rel="noreferrer"
      title={hash}
      className="mt-1 inline-flex items-center gap-1 text-xs underline underline-offset-2"
    >
      {label ?? <span className="font-mono">{shortenAddress(hash)}</span>}
      <Icon name="external" className="h-3 w-3" />
    </a>
  )
}

export function TxStatus({ tx }: { tx: TxState }) {
  const { hash, isSigning, isConfirming, isSuccess, sendError, receiptFailure } = tx

  if (isSigning)
    return (
      <Notice tone="info" loading>
        Đang chờ bạn xác nhận trong MetaMask…
      </Notice>
    )

  if (isConfirming)
    return (
      <Notice tone="info" loading>
        <p>Giao dịch đã gửi, đang chờ xác nhận trên mạng…</p>
        {hash && <ExplorerLink hash={hash} label="Theo dõi trên Etherscan" />}
      </Notice>
    )

  if (sendError) return <Notice tone="error">Giao dịch thất bại: {getErrorMessage(sendError)}</Notice>

  if (receiptFailure && hash) {
    if (receiptFailure.kind === 'reverted')
      return (
        <Notice tone="error">
          <p className="font-medium">Giao dịch bị revert trên chain</p>
          <p className="mt-1 text-xs leading-relaxed">
            Giao dịch đã vào block nhưng thực thi thất bại nên phí gas vẫn bị trừ. Nguyên nhân thường gặp:
            địa chỉ nhận là smart contract từ chối ETH, gas limit quá thấp, hoặc điều kiện của contract không
            thỏa. Mở Etherscan để xem lý do chi tiết.
          </p>
          <ExplorerLink hash={hash} label="Xem lỗi trên Etherscan" />
        </Notice>
      )

    if (receiptFailure.kind === 'timeout')
      return (
        <Notice tone="warning">
          <p className="font-medium">Chưa thấy kết quả sau 2 phút</p>
          <p className="mt-1 text-xs leading-relaxed">
            Giao dịch có thể vẫn đang chờ trong mempool hoặc RPC đang chậm. Kiểm tra trạng thái thật trên
            Etherscan.
          </p>
          <ExplorerLink hash={hash} label="Kiểm tra trên Etherscan" />
        </Notice>
      )

    return (
      <Notice tone="error">
        <p className="font-medium">Không xác nhận được giao dịch</p>
        <p className="mt-1 break-words text-xs">{receiptFailure.message}</p>
        <ExplorerLink hash={hash} label="Kiểm tra trên Etherscan" />
      </Notice>
    )
  }

  if (isSuccess && hash)
    return (
      <Notice tone="success">
        <p className="font-medium">Giao dịch thành công</p>
        <ExplorerLink hash={hash} />
      </Notice>
    )

  return null
}
