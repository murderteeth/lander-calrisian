import { useState, useEffect } from "react"
import { LuArrowRight, LuBadgeDollarSign } from "react-icons/lu"
import Button from "../../Button"
import Input from "../../Input"
import BgBrave from "../bg-brave"
import Odometer from "../Odometer"
import { FORMAT_4_DECIMALS, FORMAT_6_DECIMALS } from "../Odometer/constants"
import RotatingTagline from "../RotatingTagline"

const VAULT_INCREMENT = 14.33
const VAULT_TVL = 104_000_000

interface HeroProps {
  onLearnMore: () => void
}

export default function Hero({ onLearnMore }: HeroProps) {
  const [vaultEarnings, setVaultEarnings] = useState(46864.18271)
  const [depositAmount, setDepositAmount] = useState(1000)
  const [userEarnings, setUserEarnings] = useState(1000)

  useEffect(() => {
    const interval = setInterval(() => {
      setVaultEarnings(prev => prev + VAULT_INCREMENT)
      setUserEarnings(prev => {
        const userIncrement = VAULT_INCREMENT * (depositAmount / VAULT_TVL)
        return prev + userIncrement
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [depositAmount])

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0
    setDepositAmount(value)
    setUserEarnings(value)
  }

  return (
    <section id="hero" className="relative w-full min-h-screen text-white flex flex-col items-start gap-12">
      <BgBrave />

      <div className="w-full px-[12%] py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0657f9] rounded-full">
            <img src="/y-white.svg" alt="Yearn Finance" className="w-10 h-10" />
          </div>
          <div className="mb-1 text-2xl font-bold">yearn</div>
        </div>
        <div className="hidden">
          <Button className="text-base h-8">Connect</Button>
        </div>
      </div>

      <div className="w-full px-[12%] flex">
        <div className="w-[75%] pt-36 flex flex-col gap-8">
          <div className="w-full flex flex-col">
            <h1 className="-mb-2 text-2xl font-bold">Earn on your crypto with</h1>
            <h1 className="text-5xl font-bold uppercase">The safest Yields Onchain</h1>
          </div>

          <div className="px-2 text-2xl">
            <RotatingTagline
              messages={[
                "A brave new world of yield",
                "Rotating tagline two",
                "Rotating tagline three",
              ]}
            />
          </div>

          <div className="mt-8 flex items-center gap-8">
            <Button className="px-12" onClick={onLearnMore}>Learn more</Button>
            <Button className="px-12 flex items-center gap-3">
              <div>Explore vaults</div>
            </Button>
          </div>
        </div>

        <div className={`w-[25%] px-6 py-7 flex flex-col gap-6
          bg-slate-900 border border-interactive-secondary-border
          drop-shadow-2 drop-shadow-secondary-950/68 rounded-lg`}>
          <div className="w-full h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-950 rounded-full">
                <LuBadgeDollarSign className="text-3xl" />
              </div>
              <div className="text-xl text-slate-200 font-bold">
                yUSD
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-1">
            <div>TVL .......</div>
            <div className="text-xl flex justify-end font-mono">$ 104M</div>
            <div>APY ......</div>
            <div className="text-xl flex justify-end font-mono">8.99 %</div>
          </div>

          <div className="flex flex-col items-end">
            <div className="w-full flex items-center justify-between text-3xl font-mono">
              <div>$</div>
              <Odometer value={vaultEarnings} format={FORMAT_4_DECIMALS} />
            </div>
            <div>Earning now</div>
          </div>

          <div className="w-full py-4 flex flex-col items-center justitfy-center gap-6 text-primary-200">
            <div className="w-full flex flex-col items-end gap-2 text-secondary-400">
              <div className="w-full text-sm">Enter a deposit amount</div>
              <Input className="w-full text-primary-100 bg-black" type="number" value={depositAmount} onChange={handleDepositChange} />
            </div>

            <div className="w-full flex flex-col items-end">
              <div className="w-full flex items-center justify-between text-2xl font-mono">
                <div>$</div>
                <Odometer value={userEarnings} format={FORMAT_6_DECIMALS} />
              </div>
              <div>You earn</div>
            </div>
            <div className="text-secondary-400">
              . ..... ..... . ...... . .. ...... ...... ........ ....... ....... . ... .... . ... ....... .... .... ........ ....... ... .... . ...... ..... ... ....... .... ..... ...... ....... .... . ........ ..
            </div>
            <Button variant="accent" className="w-full h-12 flex items-center gap-3 text-slate-950! font-bold">
              <div>Start earning</div>
              <LuArrowRight />
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}
