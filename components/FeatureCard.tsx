import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  width?: string; 
  height?: string;
}

const FeatureCard = ({ icon, title, description, width = "w-full", height = "h-auto" }: FeatureCardProps) => {
  return (
    <div
      className={`group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start ${width} ${height}`}
    >
      {/* Icon Container */}
      <div className="w-12 h-12 bg-[#F8F7FF] rounded-2xl flex items-center justify-center mb-8 self-start group-hover:scale-110 transition-transform">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-[#0F172A] mb-3 w-full">
        {title}
      </h3>
      <p className="text-[#62748E] text-sm leading-relaxed w-full">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;