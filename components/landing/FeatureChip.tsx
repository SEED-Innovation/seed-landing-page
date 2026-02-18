import React from 'react';
import { motion } from 'framer-motion';

type FeatureChipProps = {
  icon: React.ElementType; 
  label: React.ReactNode;
  className?: string;
  color: string;
  delay: number;
  side: 'left' | 'right';
  driftX: number;
  driftY: number;
};

export default function FeatureChip({ 
  icon: Icon, 
  label, 
  className = "", 
  color, 
  delay, 
  side, 
  driftX, 
  driftY 
}: FeatureChipProps) { 
  
  // Reduce the drift by 50% to make it stay "closer"
  const tightDriftX = driftX * 0.5;
  const tightDriftY = driftY * 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: side === 'left' ? 100 : -100, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 60, damping: 25, delay }}
      className={`absolute z-50 ${className}`}
      style={{ willChange: "transform" }} // Keeps text from blurring/shaking
    >
      <motion.div
        animate={{
          x: [0, tightDriftX, 0, -tightDriftX, 0],
          y: [0, tightDriftY, 0, -tightDriftY, 0],
        }}
        whileHover={{ 
          scale: 1.08,
          transition: { duration: 0.2 } 
        }}
        transition={{
          // Slightly faster durations (8s and 10s instead of 10s and 12s)
          // makes the "tight" movement feel more energetic
          x: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: delay },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: delay },
        }}
        className="flex flex-col items-center justify-center p-1.5 md:p-4 w-24 md:w-32 h-24 md:h-32 gap-1 md:gap-2 rounded-xl md:rounded-3xl /95 backdrop-blur-md border border-white/50 shadow-lg md:shadow-xl cursor-pointer"
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