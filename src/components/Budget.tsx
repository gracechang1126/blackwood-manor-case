import { useState } from 'react';
import { Calculator, Gift, Lock, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { allPriceItems, priceList } from '../data/prices';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface BudgetState {
  justin: string;
  jeremy: string;
  spending: string;
  additional: string;
}
interface Cart {
  counts: Record<string, number>;
  free: string; // item code unlocked for free (once per game)
}

const EMPTY: BudgetState = { justin: '', jeremy: '', spending: '', additional: '' };

function useBudget() {
  return useLocalStorage<BudgetState>('bmc.budget', EMPTY);
}
function useCart() {
  return useLocalStorage<Cart>('bmc.cart', { counts: {}, free: '' });
}

const num = (s: string) => (s.trim() === '' || isNaN(Number(s)) ? 0 : Number(s));

function cartTotal(cart: Cart) {
  return allPriceItems.reduce((sum, it) => {
    const n = cart.counts[it.code] ?? 0;
    const paid = cart.free === it.code ? Math.max(0, n - 1) : n;
    return sum + paid * it.cost;
  }, 0);
}

/* ---------- wide screens: inputs placed in the original boxes ---------- */

const FIELDS: { key: keyof BudgetState; label: string; rect: [number, number, number, number] }[] = [
  { key: 'justin', label: 'Justin 目前擁有金幣', rect: [0.556, 0.177, 0.196, 0.093] },
  { key: 'jeremy', label: 'Jeremy 目前擁有金幣', rect: [0.56, 0.279, 0.196, 0.093] },
  { key: 'spending', label: '本週花費 TOTAL', rect: [0.613, 0.494, 0.166, 0.1] },
  { key: 'additional', label: '增加預算 TOTAL', rect: [0.62, 0.739, 0.167, 0.1] },
];

export function BudgetOverlay() {
  const [b, setB] = useBudget();
  const [open, setOpen] = useState(false);
  return (
    <>
      {FIELDS.map((f) => (
        <input
          key={f.key}
          type="number"
          inputMode="numeric"
          min={0}
          aria-label={f.label}
          placeholder="0"
          value={b[f.key]}
          onChange={(e) => setB({ ...b, [f.key]: e.target.value })}
          style={{ left: `${f.rect[0] * 100}%`, top: `${f.rect[1] * 100}%`, width: `${f.rect[2] * 100}%`, height: `${f.rect[3] * 100}%`, fontSize: '3.4cqw' }}
          className="absolute rounded-[1cqw] bg-transparent text-center font-serif font-bold text-ink placeholder:text-ink/25 focus:bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]"
        />
      ))}
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ left: '33%', top: '87.5%', fontSize: '1.45cqw' }}
        className="absolute flex items-center gap-[0.5cqw] rounded-full border border-brass/60 bg-gradient-to-r from-wine-dark to-[#7a3b2c] px-[1.4cqw] py-[0.6cqw] font-tc font-bold text-parchment shadow-lg transition hover:brightness-125"
      >
        <Calculator style={{ width: '1.6cqw', height: '1.6cqw' }} /> 金幣計算器
      </button>
      <Summary b={b} className="absolute left-[18.5%] top-[2.2%] text-[1.25cqw]" />
      {open && <CalculatorSheet onClose={() => setOpen(false)} onApply={(t) => setB({ ...b, spending: String(t) })} />}
    </>
  );
}

function Summary({ b, className = '' }: { b: BudgetState; className?: string }) {
  const remaining = num(b.justin) + num(b.jeremy) + num(b.additional) - num(b.spending);
  return (
    <div className={`rounded-full bg-black/60 px-[1em] py-[0.35em] font-tc text-parchment ${className}`}>
      剩餘金幣：<b className={remaining < 0 ? 'text-red-400' : 'text-brass'}>{remaining}</b>
    </div>
  );
}

/* ---------- portrait phones: a regular form ---------- */

export function BudgetCards() {
  const [b, setB] = useBudget();
  const [open, setOpen] = useState(false);
  const field = (key: keyof BudgetState, label: string, sub: string) => (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="leading-tight">
        <span className="block font-bold">{label}</span>
        <span className="block font-serif text-sm text-ink/70">{sub}</span>
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        placeholder="0"
        value={b[key]}
        onChange={(e) => setB({ ...b, [key]: e.target.value })}
        className="h-12 w-32 rounded-lg border-2 border-ink/30 bg-parchment text-center font-serif text-2xl font-bold text-ink focus:border-[#8b1a1a] focus:outline-none"
      />
    </label>
  );
  return (
    <section className="wide:hidden mx-auto w-full max-w-xl px-4 pt-4" aria-label="我的預算">
      <div className="divide-y divide-ink/15 rounded-2xl border border-[#c8b08a] bg-paper px-4 py-2 font-tc text-ink shadow-lg shadow-black/40">
        <div className="py-2">
          <h2 className="font-bold">① 目前擁有金幣 <span className="font-serif text-sm text-ink/70">Current Coins</span></h2>
          {field('justin', 'JUSTIN', '')}
          {field('jeremy', 'JEREMY', '')}
        </div>
        {field('spending', '② 本週花費預算', "This Week's Spending · TOTAL")}
        {field('additional', '③ 增加預算', 'Additional Budget · TOTAL')}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <Summary b={b} className="text-base" />
        <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#8b1a1a] px-4 font-bold text-white">
          <Calculator size={18} /> 金幣計算器
        </button>
      </div>
      {open && <CalculatorSheet onClose={() => setOpen(false)} onApply={(t) => setB({ ...b, spending: String(t) })} />}
    </section>
  );
}

/* ---------- calculator sheet (shared) ---------- */

function CalculatorSheet({ onClose, onApply }: { onClose: () => void; onApply: (total: number) => void }) {
  const [cart, setCart] = useCart();
  const total = cartTotal(cart);
  const set = (code: string, n: number) => setCart({ ...cart, counts: { ...cart.counts, [code]: Math.max(0, n) } });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 animate-fade sm:items-center" role="dialog" aria-modal="true" aria-label="金幣計算器" onClick={onClose}>
      <div
        className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-brass/40 bg-paper font-tc text-ink shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/15 bg-wood px-4 py-3 text-parchment">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Calculator size={20} className="text-brass" /> 金幣計算器</h2>
          <button type="button" aria-label="關閉" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"><X size={22} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {priceList.map((c) => (
            <div key={c.no} className="py-2">
              <h3 className="mb-1 flex items-baseline gap-2 px-1 font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ink text-sm">{c.no}</span>
                {c.name}
                {c.note && <span className="text-xs font-normal text-ink/60">{c.note}</span>}
              </h3>
              <ul className="divide-y divide-ink/10 rounded-lg bg-parchment">
                {c.items.map((it) => {
                  const n = cart.counts[it.code] ?? 0;
                  const isFree = cart.free === it.code;
                  return (
                    <li key={it.code} className="flex items-center gap-2 px-2 py-1.5">
                      <div className="min-w-0 flex-1 leading-tight">
                        <div className="text-[15px]">
                          <span className="mr-1 text-ink/60">{it.code}</span>{it.name}
                        </div>
                        <div className="text-xs text-ink/60">
                          {it.cost} 金幣／{it.unit}
                          {it.note && <span className="ml-1 inline-flex items-center gap-0.5 text-[#8b1a1a]"><Lock size={11} />{it.note}</span>}
                        </div>
                      </div>
                      <button
                        type="button"
                        title="全程 1 次免費解鎖"
                        aria-pressed={isFree}
                        onClick={() => setCart({ ...cart, free: isFree ? '' : it.code })}
                        className={`flex h-9 items-center gap-1 rounded-full px-2 text-xs ${isFree ? 'bg-brass text-wood' : 'text-ink/40 hover:text-ink'}`}
                      >
                        <Gift size={16} />{isFree && '免費'}
                      </button>
                      <div className="flex items-center">
                        <button type="button" aria-label={`減少 ${it.name}`} onClick={() => set(it.code, n - 1)} disabled={n === 0} className="flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 disabled:opacity-30"><Minus size={18} /></button>
                        <span className="w-8 text-center text-lg font-bold tabular-nums">{n}</span>
                        <button type="button" aria-label={`增加 ${it.name}`} onClick={() => set(it.code, n + 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5c0f0f] text-parchment"><Plus size={18} /></button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className="flex items-center gap-1.5 px-1 pb-2 text-xs text-ink/70">
            <Gift size={14} /> 免費解鎖：全程 1 次，可任選五大類別中的 1 個項目免費解鎖。
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 bg-[#e6d5b5] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="text-lg">合計 <b className="text-2xl text-[#8b1a1a] tabular-nums">{total}</b> 金幣</div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setCart({ counts: {}, free: cart.free })} className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-ink/30 px-3"><RotateCcw size={16} /> 清除</button>
            <button type="button" onClick={() => { onApply(total); onClose(); }} className="min-h-[44px] rounded-full bg-[#8b1a1a] px-4 font-bold text-white">填入本週花費</button>
          </div>
        </div>
      </div>
    </div>
  );
}
