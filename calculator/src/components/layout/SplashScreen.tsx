// Brief luxury loading animation shown on first load — a monogram crest
// that draws itself in, then hands off to the app.

import { motion } from 'framer-motion'

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-[#060F1E]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A227]/60"
      >
        <span className="font-serif text-2xl font-semibold text-[#E8CF83]">H&amp;H</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Hangar &amp; Harbor</p>
        <div className="mt-3 h-px w-40 overflow-hidden rounded-full bg-white/10">
          <div className="hh-shimmer h-full w-full" />
        </div>
      </motion.div>
    </motion.div>
  )
}
