/**
 * Fisher-Yates shuffle that guarantees the result differs from the original order.
 */
export function shuffleWithGuarantee<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // If shuffle produced the same order, swap the first two elements
  const isSame = shuffled.every((item, i) => item === arr[i]);
  if (isSame && shuffled.length > 1) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}
