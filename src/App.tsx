import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useGamba } from 'gamba-react-v2'
import React from 'react'

const tokenUnits = (amount: number, decimals = 9) => {
  return amount * (10 ** decimals)
}

const formatTokenAmount = (amount: number, decimals = 9) => {
  return (amount / (10 ** decimals)).toLocaleString(undefined, {maximumFractionDigits: decimals})
}

export default function App() {
  const [result, setResult] = React.useState<number | null>(null)
  const gamba = useGamba()

  const play = async () => {
    // Start a bet
    await gamba.play({
      // The potential outcomes we want for the bet (2x or 0x)
      bet: [2, 0],
      // Amount of coins
      wager: tokenUnits(0.01),
      // The token we want to use for the bet (SOL is default)
      token: "So11111111111111111111111111111111111111112",
      // The address where fees will appear
      creator: "V2grJiwjs25iJYqumbHyKo5MTK7SFqZSdmoRaj8QWb9",
      // Our platform will receive 1% of every bet
      creatorFee: 0.01,
      // This seed will affect the result, giving the player an option to change this value will assure them that the result is fair.
      clientSeed: "anything goes",
    })
    // Get the result of the bet
    const result = await gamba.result()
    setResult(result.payout)
  }

  return (
    <>
      <WalletMultiButton />
      <button disabled={gamba.isPlaying} onClick={play}>
        Play
      </button>
      {gamba.isPlaying ? (
        <>Rolling</>
      ) : result !== null && (
        <>
          {formatTokenAmount(result)}
        </>
      )}
    </>
  )
}
