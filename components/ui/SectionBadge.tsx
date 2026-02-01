"use client";

import React from 'react';

interface SectionBadgeProps {
  children: React.ReactNode;
}

const SectionBadge = ({ children }: SectionBadgeProps) => {
  return (
    <span className={`
      text-[#A855F7] 
      font-bold 
      text-sm 
      md:text-xl 
      tracking-[0.2em] 
      uppercase 
      mb-4 
      block 
      font-saudia 
    `}>
      {children}
    </span>
  );
};

export default SectionBadge;