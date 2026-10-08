// components/ui/styles.ts
// Class Tailwind dùng lại cho input / button.
export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 ' +
  'placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 ' +
  'focus:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-slate-100'

export const primaryButtonClass =
  'inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm ' +
  'font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-300'

export const ghostButtonClass =
  'inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 ' +
  'text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-indigo-500'
