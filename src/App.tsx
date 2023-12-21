import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useGamba, type GameResult } from 'gamba-react-v2'
import React from 'react'

const tokens = {
  sol: {
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  }
}

const getToken = (mint: string) => {
  const token = Object.entries(tokens).find(([k, v]) => mint === v.mint)
  return token && token[1]
}

const tokenUnits = (amount: number, decimals = 9) => {
  return amount * (10 ** decimals)
}

const formatTokenAmount = (amount: number, decimals = 9) => {
  return (amount / (10 ** decimals)).toLocaleString(undefined, {maximumFractionDigits: decimals})
}

export default function App() {
  const [selectedToken] = React.useState(tokens.sol)
  const [result, setResult] = React.useState<GameResult>()
  const gamba = useGamba()

  const play = async () => {
    // Start a bet
    await gamba.play({
      // The potential outcomes for the bet
      bet: [2, 0], // (2x or 0x)
      // Amount of tokens
      wager: tokenUnits(0.01, selectedToken.decimals),
      // The token we want to use for the bet (SOL is default)
      token: selectedToken.mint,
      // The address where fees will go to
      creator: "V2grJiwjs25iJYqumbHyKo5MTK7SFqZSdmoRaj8QWb9",
      // The % amount that the creator address will receive for every bet
      creatorFee: 0.01, // 0.01 = 1%
      // This seed will affect the result. Giving the player an option to change this value will assure them that the result is fair.
      clientSeed: "anything goes",
    })
    // Get the result of the bet
    const result = await gamba.result()
    setResult(result)
  }

  return (
    <>
      <WalletMultiButton />
      <button disabled={gamba.isPlaying} onClick={play}>
        Play
      </button>
      {gamba.isPlaying ? (
        "Rolling"
      ) : result && (
        <>
          {formatTokenAmount(
            result.payout,
            getToken(result.token.toBase58())?.decimals
          )}
        </>
      )}
    </>
  )
}
