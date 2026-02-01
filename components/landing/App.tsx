'use client';

import { useTranslations } from 'next-intl';
import { Camera, Cpu, Activity, BarChart3, Target, Share2 } from 'lucide-react';
import FeatureChip from './FeatureChip';
import SectionBadge from '../ui/SectionBadge';
export default function AppSection() {
  const t = useTranslations('LandingPage.AppSection');

  return (
    <section className="relative pt-12 pb-0 md:pt-32 bg-[#F8FAFC] overflow-hidden mt-50 md:mt-0" 
    style={{
    backgroundColor: '#F8FAFC',
    /* Using two radial gradients: 
       1. Top Right: Starts at 0% (strongest) and fades out by 50%
       2. Bottom Left: Starts at 0% (strongest) and fades out by 50%
    */
    backgroundImage: `
      radial-gradient(circle at top right, #E9D4FF66 20%, transparent 50%),
      radial-gradient(circle at bottom left, #BEDBFF66 20%, transparent 60%)
    `
  }}>
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-8 md:mb-12 relative z-30 font-saudia">
          <SectionBadge>{t('tag')}</SectionBadge>
          <h2 className="text-4xl md:text-6xl font-black mt-2 md:mt-4 text-[#0F172A] leading-tight">{t('title')}</h2>
          <p className="mt-4 text-[#62748E] max-w-2xl mx-auto text-lg leading-relaxed px-2">
             {t.rich('description', { highlight: (chunks) => <span className="text-slate-900 font-bold bg-[#D9F99D] px-1">{chunks}</span> })}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[1000px] flex justify-center items-end h-[450px] md:h-[600px]">
          <div className="relative z-10 pointer-events-none translate-y-4 md:translate-y-10">
            <img
              src="/mobile.png"
              alt="Seed App"
              className="w-70 md:w-full h-100 md:h-150 drop-shadow-2xl"
            />
          </div>

          {/* LEFT SIDE */}
          <FeatureChip side="left" driftX={10} driftY={-12} delay={0.1} icon={Camera} label={t('features.cameras')} className="bottom-[75%] left-0 sm:left-[5%] xl:left-[8%]" color="#9810FA" />
          <FeatureChip side="left" driftX={-8} driftY={15} delay={0.2} icon={Activity} label={t('features.stats')} className="bottom-[40%] -left-4 sm:left-0 xl:left-[2%]" color="#155DFC" />
          <FeatureChip side="left" driftX={12} driftY={-10} delay={0.3} icon={Target} label={t('features.tracking')} className="bottom-[5%] left-0 sm:left-[5%] xl:left-[8%]" color="#FB2C36" />

          {/* RIGHT SIDE */}
          <FeatureChip side="right" driftX={-10} driftY={12} delay={0.15} icon={Cpu} label={t('features.ai')} className="bottom-[75%] right-0 sm:right-[5%] xl:right-[8%]" color="#4F39F6" />
          <FeatureChip side="right" driftX={8} driftY={-15} delay={0.25} icon={BarChart3} label={t.rich('features.reports', { br: () => <br /> })} className="bottom-[40%] -right-4 sm:right-0 xl:right-[2%]" color="#00A63E" />
          <FeatureChip side="right" driftX={-12} driftY={10} delay={0.35} icon={Share2} label={t.rich('features.share', { br: () => <br /> })} className="bottom-[5%] right-0 sm:right-[5%] xl:right-[8%]" color="#FF6900" />
        </div>
      </div>
    </section>
  );
}