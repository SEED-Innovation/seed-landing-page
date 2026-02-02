"use client";

import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean; // Toggle for dark sections like Tech
}

const SectionTitle = ({ children,className = "", dark = false }: SectionTitleProps) => {
  return (
    <h2 className={`
      text-4xl 
      md:text-5xl 
      font-bold 
      leading-14
      mb-5
      ${className}
    `}>
      {children}
    </h2>
  );
};

export default SectionTitle;