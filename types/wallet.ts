export interface Token {
    name: string
    symbol: string
    balance: string
    value: string
    address: string
    networks: string[]
  }
  
  export interface WalletState {
    tokens: Token[]
    totalBalance: number
    isLoading: boolean
    error: string | null
  }
  
  