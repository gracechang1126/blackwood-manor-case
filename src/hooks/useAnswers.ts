import { useLocalStorage } from './useLocalStorage';

/** Selected option per weekly question, e.g. { Q17: 'B' }. */
export function useAnswers() {
  return useLocalStorage<Record<string, string>>('bmc.weekly-answers', {});
}
