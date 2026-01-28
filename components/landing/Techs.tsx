import React from 'react';
import { useTranslations } from 'next-intl';
import { Activity, Target, Cpu, Camera } from 'lucide-react';

const Techs = () => {
  const t = useTranslations('Techs');

  const techs = [
    {
      key: 'liveStats',
      icon: <Activity className="w-6 h-6 text-purple-600" />,
    },
    {
      key: 'shotTracking',
      icon: <Target className="w-6 h-6 text-purple-600" />,
    },
    {
      key: 'aiAnalysis',
      icon: <Cpu className="w-6 h-6 text-purple-600" />,
    },
    {
      key: 'cameras4k',
      icon: <Camera className="w-6 h-6 text-purple-600" />,
    },
  ];

  return (
    <section 
      className="py-20 px-6 md:py-28"
      style={{
        // Responsive CSS radial gradient to mimic the 240px blur glow from Figma
        backgroundImage: 'radial-gradient(80% 40% at 50% 30%, rgba(243, 232, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
            <span className="text-[#7C3AED] font-bold text-lg md:text-2xl tracking-widest uppercase">
                {t('badge')}
            </span>
            <h2 className="text-4xl md:text-6xl font-black mt-2 md:mt-4 text-[#0F172A] leading-tight"> 
                {t('title')}
            </h2>
          <p className="mt-4 text-[#62748E] max-w-2xl mx-auto text-lg leading-relaxed px-2">
             {t.rich('description', { highlight: (chunks) => <span className="text-slate-900 font-bold bg-[#D9F99D] px-1">{chunks}</span> })}
            </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {techs.map((tech) => (
            <div
              key={tech.key}
              className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-[#F8F7FF] rounded-2xl flex items-center justify-center mb-8 self-start group-hover:scale-110 transition-transform">
                {tech.icon}
              </div>
              
              <h3 className="text-xl font-bold text-[#0F172A] mb-3 w-full">
                {t(`items.${tech.key}.title`)}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed w-full">
                {t(`items.${tech.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Techs;