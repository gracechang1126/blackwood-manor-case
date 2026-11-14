import { Check, ExternalLink, RotateCcw } from 'lucide-react';
import { GOOGLE_FORM_URL, weeklyQuestions } from '../data/questions';
import { useAnswers } from '../hooks/useAnswers';

/** Wide screens: clickable A–D rows drawn over the original question cards. */
export function QuestionsOverlay() {
  const [answers, setAnswers] = useAnswers();
  return (
    <>
      {weeklyQuestions.flatMap((q) =>
        q.options.map((o) => {
          const selected = answers[q.id] === o.key;
          return (
            <button
              key={q.id + o.key}
              type="button"
              aria-pressed={selected}
              aria-label={`${q.id} ${o.key}. ${o.en}`}
              onClick={() => setAnswers({ ...answers, [q.id]: selected ? '' : o.key })}
              style={{ left: `${o.rect.x * 100}%`, top: `${o.rect.y * 100}%`, width: `${o.rect.w * 100}%`, height: `${o.rect.h * 100}%` }}
              className={`absolute rounded-md transition ${
                selected
                  ? 'bg-amber-300/20 shadow-[0_0_0_3px_#8b1a1a,0_0_20px_rgba(139,26,26,0.6)]'
                  : 'hover:bg-amber-200/15 hover:shadow-[0_0_0_2px_rgba(139,26,26,0.6)]'
              }`}
            >
              {selected && (
                <span className="absolute -right-[2%] top-1/2 flex aspect-square h-[55%] -translate-y-1/2 items-center justify-center rounded-full bg-[#8b1a1a] text-white shadow-lg">
                  <Check className="h-[70%] w-[70%]" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        }),
      )}
    </>
  );
}

/** Portrait phones: the same questions as readable, tappable cards. */
export function QuestionsCards() {
  const [answers, setAnswers] = useAnswers();
  const answered = weeklyQuestions.filter((q) => answers[q.id]).length;

  return (
    <section className="wide:hidden mx-auto w-full max-w-xl space-y-4 px-4 pt-4" aria-label="本週提問作答">
      {weeklyQuestions.map((q) => (
        <fieldset key={q.id} className="rounded-2xl border border-[#c8b08a] bg-paper p-4 text-ink shadow-lg shadow-black/40">
          <legend className="sr-only">{q.id}</legend>
          <div className="mb-1 inline-block rounded bg-[#f3e6cc] px-2 font-serif text-2xl font-bold text-[#6b1414]">{q.id}</div>
          <p className="font-serif text-lg font-bold leading-snug">{q.en}</p>
          <p className="mt-1 border-b border-ink/20 pb-3 text-[15px] leading-relaxed">{q.zh}</p>
          <div className="mt-3 space-y-2">
            {q.options.map((o) => {
              const selected = answers[q.id] === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setAnswers({ ...answers, [q.id]: selected ? '' : o.key })}
                  className={`flex min-h-[56px] w-full items-center gap-3 rounded-lg border p-1.5 pr-3 text-left transition active:scale-[0.99] ${
                    selected ? 'border-[#8b1a1a] bg-[#f6dcc8] ring-2 ring-[#8b1a1a]' : 'border-[#d8c3a0] bg-[#fbf3e3]'
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#5c0f0f] font-serif text-2xl font-bold text-parchment">
                    {selected ? <Check size={24} strokeWidth={3} /> : o.key}
                  </span>
                  <span className="leading-snug">
                    <span className="block font-serif text-[16px] font-bold">{o.en}</span>
                    <span className="block text-sm">{o.zh}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-col items-center gap-2 rounded-xl bg-black/40 p-3 text-center text-sm text-parchment/85">
        <p>
          已作答 {answered} / {weeklyQuestions.length}
          {answered > 0 && <> · {weeklyQuestions.map((q) => `${q.id}: ${answers[q.id] || '–'}`).join('　')}</>}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[#8b1a1a] px-4 font-bold text-white">
            提交答案（Google 表單） <ExternalLink size={16} />
          </a>
          {answered > 0 && (
            <button type="button" onClick={() => setAnswers({})} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-parchment/30 px-4">
              <RotateCcw size={16} /> 重選
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
