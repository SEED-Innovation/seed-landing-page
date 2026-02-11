"use client";

import { useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const Counter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const numericMatch = value.match(/(\d+\.?\d*)/);
  const numericPart = numericMatch ? numericMatch[0] : "0";
  const suffix = value.split(numericPart)[1] || "";
  
  const targetNumber = parseFloat(numericPart);
  const isDecimal = numericPart.includes(".");

  useEffect(() => {
    if (inView && ref.current) {
      const controls = animate(0, targetNumber, {
        duration: 1.5, // Faster, linear feel
        ease: "easeOut", // Smooth start, clean stop
        onUpdate: (latestValue) => {
          if (ref.current) {
            const formatted = isDecimal 
              ? latestValue.toFixed(1) 
              : Math.floor(latestValue).toLocaleString();
            
            ref.current.textContent = `${formatted}${suffix}`;
          }
        }
      });

      return () => controls.stop();
    }
  }, [inView, targetNumber, isDecimal, suffix]);

  return (
    <span ref={ref} className="tabular-nums font-bold">
      0{suffix}
    </span>
  );
};

export default Counter;