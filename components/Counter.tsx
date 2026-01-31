"use client";

import { useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const Counter = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // 1. Extract number and suffix
  const numericMatch = value.match(/(\d+\.?\d*)/);
  const numericPart = numericMatch ? numericMatch[0] : "0";
  const suffix = value.split(numericPart)[1] || "";
  
  const targetNumber = parseFloat(numericPart);
  const isDecimal = numericPart.includes(".");

  useEffect(() => {
    if (inView && ref.current) {
      // 2. Animate directly to avoid spring "lag" at the end
      const controls = animate(0, targetNumber, {
        duration: 1.5, // Faster, linear feel
        ease: "easeOut", // Smooth start, clean stop
        onUpdate: (latest) => {
          if (ref.current) {
            const formatted = isDecimal 
              ? latest.toFixed(1) 
              : Math.floor(latest).toLocaleString();
            
            ref.current.textContent = `${formatted}${suffix}`;
          }
        }
      });

      return () => controls.stop();
    }
  }, [inView, targetNumber, isDecimal, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
};

export default Counter;