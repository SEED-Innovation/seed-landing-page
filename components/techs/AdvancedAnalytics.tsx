"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Zap, Move, Target, Timer, Flame, TrendingUp, Map, Activity } from 'lucide-react';

const AdvancedAnalytics = () => {
  const t = useTranslations('TechnologyPage.AdvancedAnalytics');

    const stats = [
    { key: 'topSpeed', value: '142 km/h', change: '+12%', color: '#EAB308', icon: <Zap /> },
    { key: 'distance', value: '4.2 km', change: '+0.5', color: '#3B82F6', icon: <Move /> },
    { key: 'accuracy', value: '88%', change: '+5%', color: '#22C55E', icon: <Target /> },
    { key: 'playTime', value: '1h 24m', change: '-2m', color: '#A855F7', icon: <Timer /> },
    { key: 'calories', value: '850 kcal', change: '+120', color: '#EF4444', icon: <Flame /> },
    ];

  return (
    <section className="relative py-24 px-6 overflow-hidden ">
      {/* Container with Dark Linear Gradient */}
      <div 
        className="rounded-[30px] md:rounded-[60px] py-8 p-4 md:p-16 relative overflow-hidden max-w-7xl w-full mx-auto"
        style={{ background: '#0F172A' }}
      >
        <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#8E51FF] to-[#C800DE] mb-6">
                {t('title')}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                {t('description')}
            </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

            {/* Mobile Mockup Area with Floating Effect */}
            <div className="relative flex justify-center items-center py-10">
                {/* Background Decorative Frames: These mimic the effect in your design */}
                <div className="absolute w-[200px] md:w-[250px] aspect-[0.58/1] border border-6 border-slate-700/40 rounded-[1.7rem] md:rounded-[2rem] rotate-[-6deg] z-0 top-[70]  md:top-[65] mr-15" />
                <div className="absolute w-[200px] md:w-[250px] aspect-[0.58/1] border border-6 border-slate-700/20 rounded-[1.7rem] md:rounded-[2rem] rotate-[6deg]  z-0 top-[100] md:top-[120] ml-15" />

                {/* The Main Image Container */}
                <div className="relative z-10 w-[240px] md:w-[300px] drop-shadow-[0_20px_0px_rgba(142,81,255,0.2)]">
                    <img 
                        src="/mobile_tech.png" 
                        alt="Live Analysis" 
                        className="w-full h-auto object-contain pointer-events-none" 
                    />
                </div>
            </div>
            <div className="bg-[#1E293B]/40 border border-slate-700/30 rounded-[32px] p-4 md:p-8 backdrop-blur-md">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-white ltr:font-sans rtl:font-saudia">
                    {t('matchStats.title')}
                    </h3>
                    <Activity className="text-[#3B82F6] w-6 h-6" />
                </div>

                <div className="space-y-4">
                    {stats.map((stat) => (
                    <div 
                        key={stat.key} 
                        className="flex items-center justify-between p-2 md:p-4 rounded-2xl border border-slate-700/50 bg-slate-900/40 hover:bg-slate-800/60 transition-all group"
                    >
                         {/* The Colored Icon Box */}
                        <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                        style={{ 
                            backgroundColor: `${stat.color}15`, 
                        }}
                        >
                        {React.cloneElement(stat.icon, { 
                            style: { color: stat.color },
                            className: "w-6 h-6" 
                        })}
                        </div>

                        {/* Center: Metric Data */}
                        <div className="flex flex-col items-start flex-grow px-6">
                            <span className="text-[10px] md:text-xs text-slate-500 mb-0.5 ltr:font-sans rtl:font-saudia uppercase tracking-wider">
                                {t(`matchStats.${stat.key}`)}
                            </span>
                            <span className="text-xl md:text-2xl font-black text-white tracking-tight">
                                {stat.value}
                            </span>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-sm font-bold font-mono flex items-center gap-1 border
                            ${stat.change.startsWith('+') 
                                
                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            <span className="text-sm">{stat.change.startsWith('+') ? '↗' : '↘'}</span>

                            {stat.change}
                            
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
       {/* Bottom Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {[
            { key: 'progress', icon: <TrendingUp />, color: '#05DF72' },
            { key: 'heatmap', icon: <Map />, color: '#3B82F6' },
            { key: 'power', icon: <Zap />, color: '#8E51FF' }
        ].map((card, idx) => (
            <div 
            key={card.key} 
            className="bg-[#1E293B]/30 border border-slate-800 rounded-3xl p-8 hover:bg-[#1E293B]/50 transition-all duration-300 group"
            >
            {/* Glowing Icon Container */}
            <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ 
                backgroundColor: `${card.color}20`, // 15% opacity background
                boxShadow: `0 0 20px ${card.color}25` // Subtle glow
                }}
            >
                {React.cloneElement(card.icon, { 
                style: { color: card.color },
                className: "w-6 h-6" 
                })}
            </div>

            <h4 className="text-white font-bold mb-3 ltr:font-sans rtl:font-saudia text-xl">
                {t(`bottomCards.${card.key}.title`)}
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed">
                {t(`bottomCards.${card.key}.desc`)}
            </p>
            </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedAnalytics;