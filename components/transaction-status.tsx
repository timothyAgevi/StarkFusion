"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, ExternalLink, ArrowRight } from "lucide-react"

interface TransactionStatusProps {
  txHash: string
  fromNetwork: "ethereum" | "starknet"
  toNetwork: "ethereum" | "starknet"
  amount: string
  fromToken: string
  toToken: string
}

export function TransactionStatus({
  txHash,
  fromNetwork,
  toNetwork,
  amount,
  fromToken,
  toToken,
}: TransactionStatusProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"pending" | "bridging" | "completed">("pending")

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStatus("completed")
          clearInterval(timer)
          return 100
        }
        if (prev >= 50 && status === "pending") {
          setStatus("bridging")
        }
        return prev + 10
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [status])

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Transaction Submitted"
      case "bridging":
        return "Bridging in Progress"
      case "completed":
        return "Swap Completed"
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "bridging":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
    }
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === "completed" ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Clock className="w-5 h-5 text-blue-500" />
            )}
            {getStatusText()}
          </div>
          <Badge variant={status === "completed" ? "default" : "secondary"}>{status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className={`w-3 h-3 rounded-full mx-auto ${progress >= 33 ? getStatusColor() : "bg-gray-300"}`} />
            <div className="text-xs text-gray-600">Submitted</div>
          </div>
          <div className="space-y-1">
            <div className={`w-3 h-3 rounded-full mx-auto ${progress >= 66 ? getStatusColor() : "bg-gray-300"}`} />
            <div className="text-xs text-gray-600">Bridging</div>
          </div>
          <div className="space-y-1">
            <div className={`w-3 h-3 rounded-full mx-auto ${progress >= 100 ? getStatusColor() : "bg-gray-300"}`} />
            <div className="text-xs text-gray-600">Completed</div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Amount</span>
            <span className="font-medium">
              {amount} {fromToken}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Badge variant="outline">{fromNetwork}</Badge>
            <ArrowRight className="w-3 h-3" />
            <Badge variant="outline">{toNetwork}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Transaction Hash</span>
            <div className="flex items-center gap-1">
              <code className="text-xs bg-white px-2 py-1 rounded">
                {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(
                    `${fromNetwork === "ethereum" ? "https://etherscan.io" : "https://starkscan.co"}/tx/${txHash}`,
                    "_blank",
                  )
                }
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {status === "completed" && (
          <div className="text-center text-sm text-green-600 font-medium">
            ✅ Successfully swapped {amount} {fromToken} to {toToken}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
