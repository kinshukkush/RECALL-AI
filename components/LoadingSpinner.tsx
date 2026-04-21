'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      <div className="relative w-24 h-24 perspective-container">
        {/* Outer Ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-t-2 border-b-2 border-cyan-400"
          animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle Ring */}
        <motion.div 
          className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-500"
          animate={{ rotateX: -360, rotateY: 360, rotateZ: 180 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner glow element */}
        <motion.div 
          className="absolute inset-6 rounded-full bg-cyan-500/30 blur-md"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.p 
        className="text-cyan-400 font-medium tracking-widest text-sm uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.p>
    </div>
  );
}
