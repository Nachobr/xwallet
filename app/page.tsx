'use client'

import { useState } from 'react'
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, Settings, Bitcoin, EclipseIcon as Ethereum, Dog } from 'lucide-react'
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useWallet } from '../hooks/useWallet'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'

export default function CryptoWalletMobile() {
  const { tokens, totalBalance, isLoading, sendTransaction, receiveAddress, deposit } = useWallet()
  const [isSendOpen, setIsSendOpen] = useState(false)
  const [isReceiveOpen, setIsReceiveOpen] = useState(false)
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [amount, setAmount] = useState('')
  const [toAddress, setToAddress] = useState('')

  const handleSend = async () => {
    if (!amount || !selectedToken || !toAddress || !selectedNetwork) {
      toast.error('Please fill in all fields')
      return
    }
    await sendTransaction(toAddress, parseFloat(amount), selectedToken, selectedNetwork)
    setIsSendOpen(false)
    toast.success('Transaction sent successfully')
  }

  const handleReceive = () => {
    if (!selectedToken || !selectedNetwork) {
      toast.error('Please select a token and network')
      return
    }
    const address = receiveAddress(selectedToken, selectedNetwork)
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  const handleDeposit = async () => {
    if (!amount || !selectedToken || !selectedNetwork) {
      toast.error('Please fill in all fields')
      return
    }
    await deposit(parseFloat(amount), selectedToken, selectedNetwork)
    setIsDepositOpen(false)
    toast.success('Deposit successful')
  }

  const getTokenIcon = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return <Bitcoin className="h-8 w-8" />
      case 'ETH':
        return <FontAwesomeIcon icon={faEthereum} className="h-8 w-8" />
      case 'DOGE':
        return <Dog className="h-8 w-8" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold">X Wallet</h1>
        <Button variant="ghost" className="text-white hover:bg-gray-800">
          <Settings className="h-6 w-6" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 space-y-6 overflow-y-auto">
        {/* Balance Card */}
        <div className="bg-black rounded-xl p-6 space-y-2">
          <p className="text-gray-400">Total Balance</p>
          <p className="text-4xl font-bold">${totalBalance.toLocaleString()}</p>
          <div className="flex space-x-2">
            <p className="text-white">+2.5%</p>
            <p className="text-gray-400">Past 24 hours</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => setIsSendOpen(true)}
            disabled={isLoading}
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button 
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => setIsReceiveOpen(true)}
            disabled={isLoading}
          >
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Receive
          </Button>
          <Button 
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => setIsDepositOpen(true)}
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Deposit
          </Button>
        </div>

        {/* Crypto Balances */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Crypto</h2>
          <div className="space-y-4">
            {tokens.map((token, index) => (
              <div key={index} className="flex justify-between items-center bg-black rounded-xl p-4">
                <div className="flex items-center">
                  {getTokenIcon(token.symbol)}
                  <div className="ml-3">
                    <p className="font-bold">{token.name}</p>
                    <p className="text-sm text-gray-400">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{token.balance} {token.symbol}</p>
                  <p className="text-sm text-gray-400">${parseFloat(token.value).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <nav className="bg-black border-t border-gray-800">
        <div className="flex justify-around p-4">
          <Button variant="ghost" className="flex flex-col items-center text-white hover:bg-gray-800" style={{height:"55px", width:"55px"}}>
            <Wallet size={32} />
            <span className="text-xs mt-1">Wallet</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-white hover:bg-gray-800" style={{height:"55px", width:"55px"}}>
            <ArrowUpRight className="h-6 w-6" />
            <span className="text-xs mt-1">Send</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center text-white hover:bg-gray-800" style={{height:"55px", width:"55px"}}>
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </Button>
        </div>
      </nav>

      {/* Send Dialog */}
      <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Send Crypto</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the recipient's address, amount, and select the network to send from.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="token">Select Token</Label>
              <select
                id="token"
                className="w-full mt-1 bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                value={selectedToken}
                onChange={(e) => {
                  setSelectedToken(e.target.value)
                  setSelectedNetwork('')
                }}
              >
                <option value="">Select a token</option>
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
            </div>
            {selectedToken && (
              <div>
                <Label htmlFor="network">Select Network</Label>
                <select
                  id="network"
                  className="w-full mt-1 bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                >
                  <option value="">Select a network</option>
                  {tokens.find(t => t.symbol === selectedToken)?.networks.map((network) => (
                    <option key={network} value={network}>
                      {network}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="to">To Address</Label>
              <Input
                id="to"
                placeholder="Enter recipient address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <Button 
              className="w-full bg-white text-black hover:bg-gray-200"
              onClick={handleSend}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Receive Crypto</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select a token and network to receive and copy your address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="receiveToken">Select Token</Label>
              <select
                id="receiveToken"
                className="w-full mt-1 bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                value={selectedToken}
                onChange={(e) => {
                  setSelectedToken(e.target.value)
                  setSelectedNetwork('')
                }}
              >
                <option value="">Select a token</option>
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
            </div>
            {selectedToken && (
              <div>
                <Label htmlFor="receiveNetwork">Select Network</Label>
                <select
                  id="receiveNetwork"
                  className="w-full mt-1 bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                >
                  <option value="">Select a network</option>
                  {tokens.find(t => t.symbol === selectedToken)?.networks.map((network) => (
                    <option key={network} value={network}>
                      {network}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedToken && selectedNetwork && (
              <div className="p-4 bg-gray-800 rounded-lg break-all">
                {receiveAddress(selectedToken, selectedNetwork)}
              </div>
            )}
            <Button 
              className="w-full bg-white text-black hover:bg-gray-200"
              onClick={handleReceive}
              disabled={!selectedToken || !selectedNetwork}
            >
              Copy Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Deposit Crypto</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select a token, network, and enter the amount to deposit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="depositToken">Select Token</Label>
              <select
                id="depositToken"
                className="w-full mt-1 bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                value={selectedToken}
                onChange={(e) => {
                  setSelectedToken(e.target.value)
                  setSelectedNetwork('')
                }}
              >
                <option value="">Select a token</option>
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </option>
                ))}
              </select>
            </div>
            {selectedToken && (
              <div>
                <Label htmlFor="depositNetwork">Select Network</Label>
                <select
                  id="depositNetwork"
                  className="w-full mt-1 bg-gray-800 text-white border border-gray-700 rounded-md p-2"
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                >
                  <option value="">Select a network</option>
                  {tokens.find(t => t.symbol === selectedToken)?.networks.map((network) => (
                    <option key={network} value={network}>
                      {network}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label htmlFor="depositAmount">Amount</Label>
              <Input
                id="depositAmount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <Button 
              className="w-full bg-white text-black hover:bg-gray-200"
              onClick={handleDeposit}
              disabled={isLoading || !selectedToken || !selectedNetwork}
            >
              {isLoading ? 'Depositing...' : 'Deposit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

