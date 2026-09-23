import { Avatar } from "../../../components/ui/avatar"
import { CopyAddress } from "../../../components/ui/copy-address"

export interface AssetIdentityProps {
    name: string
    symbol?: string
    address: string
    avatar?: string
}

const AssetIdentity = ({ name, symbol, address, avatar }: AssetIdentityProps) => (
    <div className="flex items-center gap-3">
        <Avatar src={avatar} fallback={name} alt={name} size="lg" className="size-10" />
        <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate">
                <span className="text-sm font-semibold">{name}</span>
                {symbol && <span className="ml-1 text-xs text-muted-foreground">{symbol}</span>}
            </p>
            <CopyAddress address={address} head={8} tail={6} className="text-xs text-foreground" />
        </div>
    </div>
)

export default AssetIdentity