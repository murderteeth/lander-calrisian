import { useState, useEffect } from "react"
import { LuArrowRight, LuBadgeDollarSign, LuChevronDown } from "react-icons/lu"
import Button from "./Button"
import Input from "./Input"
import BgBrave from "./components/bg-brave"
import Odometer from "./components/Odometer"
import { FORMAT_4_DECIMALS, FORMAT_6_DECIMALS } from "./components/Odometer/constants"

const VAULT_INCREMENT = 14.33
const VAULT_TVL = 104_000_000

function App() {
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
    <div className="relative w-full min-h-screen text-white flex flex-col items-start gap-12">
      <BgBrave />

      <div className="w-full px-[12%] py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0657f9] rounded-full">
            <img src="/y-white.svg" alt="Vite" className="w-10 h-10" />
          </div>
          <div className="mb-1 text-2xl font-bold">yearn finance</div>
        </div>
        <div className="hidden">
          <Button className="text-base h-8">Connect</Button>
        </div>
      </div>

      <div className="w-full px-[12%] flex">
        <div className="w-[75%] pt-24 flex flex-col gap-8">
          <div className="w-full flex flex-col">
            <h1 className="-mb-3 text-5xl font-bold uppercase">Yearn Vaults are Brave</h1>
            <h1 className="text-5xl font-bold uppercase">New Worlds of Yield</h1>
          </div>

          <div className="text-2xl">
            Automated yield that never sleeps
          </div>

          <div className="mt-32 flex items-center gap-8">
            <Button variant="primary">Learn more</Button>
            <Button>Explore vaults</Button>
          </div>
        </div>

        <div className="w-[25%] py-6 flex flex-col gap-6">
          <div className="w-full h-16 px-4 flex items-center justify-between bg-slate-900 border border-slate-800 drop-shadow-2 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-950 rounded-full">
                <LuBadgeDollarSign className="text-3xl" />
              </div>
              <div className="text-xl text-slate-200 font-bold">
                yUSD
              </div>
            </div>
            <div>
              <LuChevronDown className="text-xl text-slate-200" />
            </div>
          </div>

          <div className="w-full px-3 grid grid-cols-2 gap-1">
            <div>TVL .......</div>
            <div className="flex justify-end font-mono">$ 104M</div>
            <div>APY ......</div>
            <div className="flex justify-end font-mono">8.99 %</div>
          </div>

          <div className="px-3 flex flex-col items-end">
            <div className="w-full flex items-center justify-between text-3xl font-mono">
              <div>$</div>
              <Odometer value={vaultEarnings} format={FORMAT_4_DECIMALS} />
            </div>
            <div>Earning now</div>
          </div>

          <div className="w-full p-4 flex flex-col items-center justitfy-center gap-6 text-primary-200 bg-slate-900 border border-slate-800 drop-shadow-2 rounded-lg">
            <Input className="w-full text-primary-100 bg-black" type="number" value={depositAmount} onChange={handleDepositChange} />
            <div className="w-full px-3 flex flex-col items-end">
              <div className="w-full flex items-center justify-between text-2xl font-mono">
                <div>$</div>
                <Odometer value={userEarnings} format={FORMAT_6_DECIMALS} />
              </div>
              <div>You earn</div>
            </div>
            <div className="">
              . ..... ..... . ...... . .. ...... ...... ........ ....... ....... . ... .... . ... ....... .... .... ........ ....... ... .... . ...... ..... ... ....... .... ..... ...... ....... .... . ........ .. 
            </div>
            <Button variant="accent" className="w-full h-12 flex items-center gap-3 text-slate-950! font-bold drop-shadow-3">
              <div>Deposit</div>
              <LuArrowRight />
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
