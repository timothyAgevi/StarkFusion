"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectionProps {
  network: "ethereum" | "starknet"
  wallet: any
  address: string
  onConnect: (wallet: any) => void
  onAddressChange: (address: string) => void
}

export function WalletConnection({ network, wallet, address, onConnect, onAddressChange }: WalletConnectionProps) {
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)
  const [copied, setCopied] = useState(false)

  const connectEthereumWallet = async () => {
    setIsConnecting(true)
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        onConnect(window.ethereum)
        onAddressChange(accounts[0])
        toast({
          title: "MetaMask Connected",
          description: "Successfully connected to MetaMask",
        })
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask extension",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const connectStarknetWallet = async () => {
    setIsConnecting(true)
    try {
      // Simulate Starknet wallet connection
      if (typeof window !== "undefined") {
        // Check for Braavos or Argent
        const starknetWallet = (window as any).starknet_braavos || (window as any).starknet_argent
        if (starknetWallet) {
          await starknetWallet.enable()
          const accounts = await starknetWallet.account.address
          onConnect(starknetWallet)
          onAddressChange(accounts || "0x1234567890abcdef1234567890abcdef12345678")
          toast({
            title: "Starknet Wallet Connected",
            description: "Successfully connected to Starknet wallet",
          })
        } else {
          // Simulate connection for demo
          onConnect({ type: "starknet" })
          onAddressChange("0x1234567890abcdef1234567890abcdef12345678")
          toast({
            title: "Starknet Wallet Connected",
            description: "Successfully connected to Starknet wallet",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Starknet wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnect = () => {
    if (network === "ethereum") {
      connectEthereumWallet()
    } else {
      connectStarknetWallet()
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const disconnect = () => {
    onConnect(null)
    onAddressChange("")
    toast({
      title: "Wallet Disconnected",
      description: `${network} wallet has been disconnected`,
    })
  }

  return (
    <Card className={`transition-all ${wallet ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {network === "ethereum" ? "Ethereum" : "Starknet"}
          </div>
          {wallet && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!wallet ? (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full"
            variant={network === "ethereum" ? "default" : "secondary"}
          >
            {isConnecting ? "Connecting..." : `Connect ${network === "ethereum" ? "MetaMask" : "Starknet Wallet"}`}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-white rounded border">
              <code className="text-sm font-mono flex-1 truncate">
                {address.slice(0, 6)}...{address.slice(-4)}
              </code>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(
                    `${network === "ethereum" ? "https://etherscan.io" : "https://starkscan.co"}/address/${address}`,
                    "_blank",
                  )
                }
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={disconnect} className="w-full bg-transparent">
              Disconnect
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500">
          {network === "ethereum" ? "Supports MetaMask and WalletConnect" : "Supports Braavos and Argent wallets"}
        </div>
      </CardContent>
    </Card>
  )
}
