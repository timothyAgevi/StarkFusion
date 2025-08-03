"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowUpDown, Wallet, Copy, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WalletConnection } from "@/components/wallet-connection"
import { TokenSelector } from "@/components/token-selector"
import { SwapDetails } from "@/components/swap-details"
import { TransactionStatus } from "@/components/transaction-status"

export default function CrossChainSwap() {
  const { toast } = useToast()
  const [fromNetwork, setFromNetwork] = useState<"ethereum" | "starknet">("ethereum")
  const [toNetwork, setToNetwork] = useState<"ethereum" | "starknet">("starknet")
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("ETH")
  const [amount, setAmount] = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [estimatedGas, setEstimatedGas] = useState("")
  const [exchangeRate, setExchangeRate] = useState("1.0")

  // Wallet states
  const [ethereumWallet, setEthereumWallet] = useState<any>(null)
  const [starknetWallet, setStarknetWallet] = useState<any>(null)
  const [ethereumAddress, setEthereumAddress] = useState("")
  const [starknetAddress, setStarknetAddress] = useState("")

  const handleNetworkSwitch = () => {
    const newFromNetwork = toNetwork
    const newToNetwork = fromNetwork
    setFromNetwork(newFromNetwork)
    setToNetwork(newToNetwork)

    // Swap tokens as well
    const newFromToken = toToken
    const newToToken = fromToken
    setFromToken(newFromToken)
    setToToken(newToToken)
  }

  const handleSwap = async () => {
    if (!amount || !destinationAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSwapping(true)
    try {
      // Simulate swap process
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setTxHash("0x1234567890abcdef1234567890abcdef12345678")
      toast({
        title: "Swap Initiated",
        description: "Your cross-chain swap has been submitted successfully",
      })
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: "There was an error processing your swap",
        variant: "destructive",
      })
    } finally {
      setIsSwapping(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    })
  }

  const isSourceWalletConnected = fromNetwork === "ethereum" ? ethereumWallet : starknetWallet
  const sourceAddress = fromNetwork === "ethereum" ? ethereumAddress : starknetAddress

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Cross-Chain Bridge</h1>
          <p className="text-gray-600">Seamlessly swap tokens between Ethereum and Starknet</p>
        </div>

        {/* Wallet Connections */}
        <div className="grid md:grid-cols-2 gap-4">
          <WalletConnection
            network="ethereum"
            wallet={ethereumWallet}
            address={ethereumAddress}
            onConnect={setEthereumWallet}
            onAddressChange={setEthereumAddress}
          />
          <WalletConnection
            network="starknet"
            wallet={starknetWallet}
            address={starknetAddress}
            onConnect={setStarknetWallet}
            onAddressChange={setStarknetAddress}
          />
        </div>

        {/* Main Swap Interface */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Cross-Chain Swap
            </CardTitle>
            <CardDescription>Bridge tokens between Ethereum and Starknet networks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">From</Label>
                <Badge variant={fromNetwork === "ethereum" ? "default" : "secondary"}>
                  {fromNetwork === "ethereum" ? "Ethereum" : "Starknet"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TokenSelector network={fromNetwork} selectedToken={fromToken} onTokenChange={setFromToken} />
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-right text-lg font-medium"
                  />
                  <div className="text-xs text-gray-500 text-right">Balance: 0.0 {fromToken}</div>
                </div>
              </div>

              {sourceAddress && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Wallet className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">From:</span>
                  <code className="text-sm font-mono bg-white px-2 py-1 rounded">
                    {sourceAddress.slice(0, 6)}...{sourceAddress.slice(-4)}
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(sourceAddress)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleNetworkSwitch}
                className="rounded-full border-2 hover:bg-blue-50 bg-transparent"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">To</Label>
                <Badge variant={toNetwork === "ethereum" ? "default" : "secondary"}>
                  {toNetwork === "ethereum" ? "Ethereum" : "Starknet"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TokenSelector network={toNetwork} selectedToken={toToken} onTokenChange={setToToken} />
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="0.0"
                    value={amount ? (Number.parseFloat(amount) * Number.parseFloat(exchangeRate)).toFixed(6) : ""}
                    readOnly
                    className="text-right text-lg font-medium bg-gray-50"
                  />
                  <div className="text-xs text-gray-500 text-right">
                    Rate: 1 {fromToken} = {exchangeRate} {toToken}
                  </div>
                </div>
              </div>

              {/* Destination Address */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="destination"
                    placeholder={`Enter ${toNetwork} address (0x... or 0x...)`}
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const targetAddress = toNetwork === "ethereum" ? ethereumAddress : starknetAddress
                      if (targetAddress) {
                        setDestinationAddress(targetAddress)
                      }
                    }}
                    disabled={
                      !((toNetwork === "ethereum" && ethereumAddress) || (toNetwork === "starknet" && starknetAddress))
                    }
                  >
                    <Wallet className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  You can paste any {toNetwork} address or use your connected wallet
                </p>
              </div>
            </div>

            <Separator />

            {/* Swap Details */}
            <SwapDetails
              fromToken={fromToken}
              toToken={toToken}
              amount={amount}
              exchangeRate={exchangeRate}
              estimatedGas={estimatedGas}
              fromNetwork={fromNetwork}
              toNetwork={toNetwork}
            />

            {/* Swap Button */}
            <Button
              onClick={handleSwap}
              disabled={!isSourceWalletConnected || !amount || !destinationAddress || isSwapping}
              className="w-full h-12 text-lg font-medium"
            >
              {isSwapping ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Swap...
                </>
              ) : !isSourceWalletConnected ? (
                `Connect ${fromNetwork} Wallet`
              ) : (
                `Swap ${fromToken} to ${toToken}`
              )}
            </Button>

            {!isSourceWalletConnected && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please connect your {fromNetwork} wallet to continue with the swap.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Transaction Status */}
        {txHash && (
          <TransactionStatus
            txHash={txHash}
            fromNetwork={fromNetwork}
            toNetwork={toNetwork}
            amount={amount}
            fromToken={fromToken}
            toToken={toToken}
          />
        )}
      </div>
    </div>
  )
}
