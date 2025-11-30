import { LuArrowRight, LuBadgeDollarSign, LuChevronDown } from "react-icons/lu"
import Button from "./Button"
import Input from "./Input"
import SynthwaveGrid from "./components/bg-brave/SynthwaveGrid"

function App() {
  return (
    <div className="relative w-full min-h-screen text-white flex flex-col items-start gap-12">
      <SynthwaveGrid />

      <div className="w-full px-[12%] py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0657f9] rounded-full">
            <img src="/y-white.svg" alt="Vite" className="w-10 h-10" />
          </div>
          <div className="mb-1 text-2xl font-bold">yearn finance</div>
        </div>
      </div>

      <div className="w-full px-[12%] flex">
        <div className="w-[75%] pt-24 flex flex-col gap-8">
          <div className="w-full flex flex-col">
            <h1 className="-mb-3 text-6xl font-bold uppercase">Yearn Vaults are Brave</h1>
            <h1 className="text-6xl font-bold uppercase">New Worlds of Yield</h1>
          </div>

          <div className="text-2xl">
            Automated yield that never sleeps
          </div>

          <div className="mt-32 flex items-center gap-6">
            <Button variant="primary">Learn more</Button>
            <Button>Explore vaults</Button>
          </div>
        </div>

        <div className="w-[25%] p-6 flex flex-col gap-6">
          <div className="w-full h-16 px-4 flex items-center justify-between bg-slate-300 border border-slate-100 drop-shadow-2 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-full">
                <LuBadgeDollarSign className="text-3xl" />
              </div>
              <div className="text-xl text-slate-900 font-bold">
                yUSD
              </div>
            </div>
            <div>
              <LuChevronDown className="text-xl text-slate-900" />
            </div>
          </div>

          <div className="w-full px-3 grid grid-cols-2 gap-1">
            <div>TVL .......</div>
            <div className="flex justify-end font-mono">$ 104M</div>
            <div>APY ......</div>
            <div className="flex justify-end font-mono">8.99 %</div>
          </div>

          <div className="px-3 flex flex-col items-end">
            <div className="text-3xl font-mono">$ 46,864.18271</div>
            <div>Earning now</div>
          </div>

          <div className="w-full p-4 flex flex-col items-center justitfy-center gap-6 text-primary-950 bg-slate-300 border border-slate-200 drop-shadow-2 rounded-lg">
            <Input className="w-full text-primary-100 bg-black" type="number" value="1000" />
            <div className="w-full px-3 flex flex-col items-end">
              <div className="text-2xl font-mono">$ 1,000.000742</div>
              <div>You can be earning</div>
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
