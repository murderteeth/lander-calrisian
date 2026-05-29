const strategies = [
  {
    name: "Morpho USDC",
    before: 32,
    after: 46,
    color: "bg-blue-500",
  },
  {
    name: "Aave USDC",
    before: 41,
    after: 29,
    color: "bg-cyan-400",
  },
  {
    name: "Curve crvUSD",
    before: 19,
    after: 17,
    color: "bg-amber-400",
  },
  {
    name: "Idle buffer",
    before: 8,
    after: 8,
    color: "bg-slate-500",
  },
]

const actions = [
  {
    tx: "0x8a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4",
    label: "Increase Morpho allocation",
    timeAgo: "1 day ago",
    value: "+$14.6M",
  },
  {
    tx: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    label: "Reduce Aave allocation",
    timeAgo: "1 day ago",
    value: "-$12.4M",
  },
  {
    tx: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3",
    label: "Keep liquidity buffer",
    timeAgo: "3 days ago",
    value: "$8.3M",
  },
]

function AllocationBar({ type }: { type: "before" | "after" }) {
  return (
    <div className="flex h-5 w-full overflow-hidden rounded-primary bg-slate-950">
      {strategies.map(strategy => (
        <div
          key={strategy.name}
          className={strategy.color}
          style={{ width: `${strategy[type]}%` }}
          title={`${strategy.name}: ${strategy[type]}%`}
        />
      ))}
    </div>
  )
}

export default function Section2() {
  return (
    <section id="section-2" className="w-full px-6 md:px-[12%] py-16 md:py-24 bg-slate-800">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold">Verifiable 24/7 Asset Management</h2>
            <p className="max-w-xl text-xl text-slate-400">
              We continuously monitor yield, risk, and liquidity, then reallocate vault capital as better opportunities emerge. 
            </p>
            <p className="max-w-xl text-xl text-slate-400">
              Every action is visible onchain. Anyone can verify where vault capital is deployed, how it moves, and what it earns.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-interactive-secondary-border bg-slate-900 p-6 drop-shadow-2 drop-shadow-secondary-950/68">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">Cross-Chain Stable Vault</div>
              <div className="text-2xl font-bold">yvUSD</div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm text-slate-400">TVL</div>
              <div className="text-xl">$104M</div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="rounded-primary border border-slate-700 bg-slate-950 p-3">
              <div className="text-xs uppercase text-slate-500">Before</div>
              <div className="font-mono text-2xl">6.42%</div>
            </div>
            <div className="rounded-primary border border-primary-700 bg-primary-950 p-3">
              <div className="text-xs uppercase text-primary-300">After</div>
              <div className="font-mono text-2xl text-primary-200">8.99%</div>
            </div>
            <div className="rounded-primary border border-emerald-500/40 bg-emerald-950/40 p-3">
              <div className="text-xs uppercase text-emerald-300">Change</div>
              <div className="font-mono text-2xl text-emerald-300">+2.57%</div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex justify-between text-sm text-slate-400">
                <span>Before</span>
                <span>Current allocation</span>
              </div>
              <AllocationBar type="before" />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm text-slate-400">
                <span>After</span>
                <span>Proposed allocation</span>
              </div>
              <AllocationBar type="after" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {strategies.map(strategy => (
              <div key={strategy.name} className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
                <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${strategy.color}`} />
                <span className="truncate">{strategy.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4">
            <div className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
              On-chain vault activity
            </div>
            <div className="grid gap-2">
              {actions.map(action => (
                <div
                  key={action.tx}
                  className="grid grid-cols-[3.75rem_minmax(0,1fr)_4.75rem_4.75rem] items-center gap-3 text-sm"
                >
                  <a
                    href={`https://etherscan.io/tx/${action.tx}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-primary-300 hover:text-primary-200"
                  >
                    {action.tx.slice(0, 6)}
                  </a>
                  <span className="truncate text-slate-400">{action.label}</span>
                  <span className="text-right text-slate-500">{action.timeAgo}</span>
                  <span className="text-right font-mono text-slate-100">{action.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
