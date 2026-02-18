"use client";

import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#ffff]"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-slate-800 border-t-[#7C3AED] rounded-full animate-spin"></div>
        
        <div className="absolute w-2 h-2 bg-[#7C3AED] rounded-full shadow-[0_0_15px_#7C3AED]"></div>
      </div>

      {/* Minimalist Brand Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <span className="text-lg font-bold tracking-widest text-white uppercase">SEED</span>
      </motion.div>
    </motion.div>
  );
};

export default Loader;