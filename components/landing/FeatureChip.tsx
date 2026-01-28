import React from 'react';
import { motion } from 'framer-motion';

// 1. Define the props clearly
type FeatureChipProps = {
  icon: React.ElementType; // Better than 'any' for Lucide/Icon components
  label: React.ReactNode;
  className?: string;
  color: string;
  delay: number;
  side: 'left' | 'right';
  driftX: number;
  driftY: number;
};

// 2. Apply the props to the function
export default function FeatureChip({ 
  icon: Icon, 
  label, 
  className = "", 
  color, 
  delay, 
  side, 
  driftX, 
  driftY 
}: FeatureChipProps) { // Use the type here!
  return (
    /* OUTER DIV: Handles the Fly-out (Phase 1) */
    <motion.div
      initial={{ opacity: 0, scale: 0, x: side === 'left' ? 150 : -150, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 50, damping: 20, delay }}
      className={`absolute z-50 ${className}`}
    >
      {/* INNER DIV: Handles Infinite Float (Phase 2) */}
      <motion.div
        animate={{
          x: [0, driftX, 0, -driftX, 0],
          y: [0, driftY, 0, -driftY, 0],
        }}
        whileHover={{ 
          x: 0, 
          y: 0, 
          scale: 1.05,
          transition: { duration: 0.3, ease: "easeOut" } 
        }}
        transition={{
          x: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: delay + 0.8 },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: delay + 0.8 },
        }}
        className="flex flex-col items-center justify-center p-1.5 md:p-4 w-24 md:w-32 h-24 md:h-32 gap-1 md:gap-2 rounded-xl md:rounded-3xl bg-white/95 backdrop-blur-md border border-white/50 shadow-lg md:shadow-xl cursor-pointer"
      >
        <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner mb-2">
          <Icon style={{ color }} className="w-6 h-6 md:w-6 md:h-6 stroke-[2.5]" />
        </div>
        <span className="text-xs md:text-sm font-bold text-slate-800 text-center leading-tight">
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}