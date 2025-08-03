"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TokenSelectorProps {
  network: "ethereum" | "starknet"
  selectedToken: string
  onTokenChange: (token: string) => void
}

const ETHEREUM_TOKENS = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠" },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether", icon: "₮" },
  { symbol: "DAI", name: "Dai Stablecoin", icon: "◈" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", icon: "₿" },
]

const STARKNET_TOKENS = [
  { symbol: "ETH", name: "Ethereum", icon: "⟠" },
  { symbol: "STRK", name: "Starknet Token", icon: "⭐" },
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether", icon: "₮" },
  { symbol: "DAI", name: "Dai Stablecoin", icon: "◈" },
]

export function TokenSelector({ network, selectedToken, onTokenChange }: TokenSelectorProps) {
  const tokens = network === "ethereum" ? ETHEREUM_TOKENS : STARKNET_TOKENS

  return (
    <Select value={selectedToken} onValueChange={onTokenChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select token" />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.symbol} value={token.symbol}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{token.icon}</span>
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-xs text-gray-500">{token.name}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
