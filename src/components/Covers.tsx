import { RotateCcw } from 'lucide-react';
import type { Cover } from '../data/covers';

interface Props {
  covers: Cover[];
  revealed: number[];
  onReveal: (i: number) => void;
  onReset?: () => void;
}

/** Black squares over evidence photos. A tap removes one; untouched ones stay covered. */
export default function Covers({ covers, revealed, onReveal, onReset }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {covers.map((c, i) => {
        const open = revealed.includes(i);
        return (
          <button
            key={i}
            type="button"
            disabled={open}
            aria-label={`翻開第 ${i + 1} 張照片`}
            title={open ? undefined : '點一下翻開'}
            onClick={(e) => {
              e.stopPropagation();
              onReveal(i);
            }}
            style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%`, width: `${c.w * 100}%`, height: `${c.h * 100}%` }}
            className={`absolute flex items-center justify-center bg-[#0b0806] shadow-[inset_0_0_0_1px_rgba(201,164,92,0.35)] transition-all duration-300 ease-out ${
              open ? 'scale-95 opacity-0' : 'pointer-events-auto cursor-pointer hover:shadow-[inset_0_0_0_2px_rgba(201,164,92,0.9)] active:scale-[0.97]'
            }`}
          >
            <span className="font-display font-bold text-brass/70" style={{ fontSize: 'max(14px, 2.6cqw)' }}>
              {c.label ?? i + 1}
            </span>
          </button>
        );
      })}
      {onReset && revealed.length > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className="pointer-events-auto absolute right-[1%] top-[1.2%] flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs text-parchment/90 transition hover:bg-black/90"
          style={{ fontSize: 'max(11px, 1.05cqw)' }}
        >
          <RotateCcw size={13} /> 全部蓋回
        </button>
      )}
    </div>
  );
}
