"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"

interface SwapDetailsProps {
  fromToken: string
  toToken: string
  amount: string
  exchangeRate: string
  estimatedGas: string
  fromNetwork: "ethereum" | "starknet"
  toNetwork: "ethereum" | "starknet"
}

export function SwapDetails({
  fromToken,
  toToken,
  amount,
  exchangeRate,
  estimatedGas,
  fromNetwork,
  toNetwork,
}: SwapDetailsProps) {
  if (!amount) return null

  const estimatedTime = fromNetwork !== toNetwork ? "10-15 minutes" : "2-3 minutes"
  const bridgeFee = "0.001 ETH"
  const networkFee = fromNetwork === "ethereum" ? "~$15" : "~$0.50"

  return (
    <Card className="bg-gray-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">Swap Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Exchange Rate</span>
          <span className="font-medium">
            1 {fromToken} = {exchangeRate} {toToken}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Network Fee</span>
          <span className="font-medium">{networkFee}</span>
        </div>

        {fromNetwork !== toNetwork && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Bridge Fee</span>
            <span className="font-medium">{bridgeFee}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-gray-600">Estimated Time</span>
          </div>
          <span className="font-medium">{estimatedTime}</span>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">You'll receive</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-lg">
                {amount ? (Number.parseFloat(amount) * Number.parseFloat(exchangeRate)).toFixed(6) : "0.0"} {toToken}
              </span>
              <Badge variant="outline" className="text-xs">
                {toNetwork}
              </Badge>
            </div>
          </div>
        </div>

        {fromNetwork !== toNetwork && (
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-gray-500">
            <Badge variant="secondary">{fromNetwork}</Badge>
            <ArrowRight className="w-3 h-3" />
            <Badge variant="secondary">{toNetwork}</Badge>
            <span>Cross-chain bridge</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
