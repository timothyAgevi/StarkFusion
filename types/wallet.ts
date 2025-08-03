export interface EthereumWallet {
  request: (args: { method: string; params?: any[] }) => Promise<any>
  selectedAddress: string | null
  isMetaMask?: boolean
}

export interface StarknetWallet {
  enable: () => Promise<void>
  account: {
    address: string
  }
  provider: any
}

declare global {
  interface Window {
    ethereum?: EthereumWallet
    starknet_braavos?: StarknetWallet
    starknet_argent?: StarknetWallet
  }
}
