/** This week's questions, transcribed from the original "This Week's Questions" screen. */
export interface Option {
  key: 'A' | 'B' | 'C' | 'D';
  en: string;
  zh: string;
  /** Hotspot rectangle on the screen image (fractions of width/height). */
  rect: { x: number; y: number; w: number; h: number };
}

export interface Question {
  id: string;
  en: string;
  zh: string;
  options: Option[];
}

// Row positions are shared by both question cards.
const ROWS = [0.515, 0.617, 0.722, 0.835];
const ROW_H = 0.093;
const col = (x: number, w: number) => ROWS.map((y) => ({ x, y, w, h: ROW_H }));
const Q17_RECTS = col(0.145, 0.335);
const Q18_RECTS = col(0.556, 0.359);

export const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeiT6U18MzmWczE018rWMHglt9O7hxX4SAd0zbAgpx6JEQWlQ/viewform';

export const weeklyQuestions: Question[] = [
  {
    id: 'Q17',
    en: 'After checking Edward’s diary, what was he concerned about on May 19?',
    zh: '查看 Edward 的日記，5 月 19 日他正在擔心什麼？',
    options: [
      { key: 'A', en: 'A missing antique', zh: '一件失蹤的古董', rect: Q17_RECTS[0] },
      { key: 'B', en: 'A disloyal employee', zh: '一名不忠的員工', rect: Q17_RECTS[1] },
      { key: 'C', en: 'A problem with Olivia', zh: 'Olivia 的問題', rect: Q17_RECTS[2] },
      { key: 'D', en: 'A problem with the garden', zh: '花園的問題', rect: Q17_RECTS[3] },
    ],
  },
  {
    id: 'Q18',
    en: 'After checking the Employee Conduct Policy, why could Edward not lend money to Jack?',
    zh: '查看員工公約後，為什麼 Edward 不能借錢給 Jack？',
    options: [
      { key: 'A', en: 'He did not trust Jack.', zh: '他不信任 Jack。', rect: Q18_RECTS[0] },
      { key: 'B', en: 'He did not have enough money.', zh: '他沒有足夠的錢。', rect: Q18_RECTS[1] },
      { key: 'C', en: 'The manor had a rule against private loans to employees.', zh: '莊園規定主人不得私下借錢給員工。', rect: Q18_RECTS[2] },
      { key: 'D', en: 'Jack had already asked too many times.', zh: 'Jack 已經請求太多次。', rect: Q18_RECTS[3] },
    ],
  },
];
