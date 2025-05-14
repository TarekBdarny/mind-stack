export function containsBothNumbersAndLetters(str: string) {
  return /[a-zA-Z]/.test(str) && /[0-9]/.test(str);
}
