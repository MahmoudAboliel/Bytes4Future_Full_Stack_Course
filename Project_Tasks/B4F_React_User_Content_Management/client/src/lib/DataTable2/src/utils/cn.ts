/** Tiny className joiner (clsx alternative — zero dependencies) */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function alignClass(align?: 'left' | 'center' | 'right'): string {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-end';
  return 'text-start';
}
