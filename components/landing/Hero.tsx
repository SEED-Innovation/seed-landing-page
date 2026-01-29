import { useTranslations } from 'next-intl';
import InfoBar from './InfoBar';

export default function Hero() {
  const t = useTranslations('LandingPage.Hero');

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full flex items-center bg-[url('/hero-bg.jpg')] bg-cover bg-center">
      {/* Dark Overlay to make text readable */}
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="relative z-10 px-6 md:px-12 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            {/* Use .rich to enable tag parsing */}
            {t.rich('title', {
                br: () => <br />,
                highlight: (chunks) => <span className="text-[#C4E009]">{chunks}</span>
            })}
        </h1>
        
        <p className="mt-4 text-lg text-white/80 ">
          {t('description')}
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        
        {/* Download Button - Primary Action */}
        <button className="h-14 w-full sm:w-56 cursor-pointer bg-[#7C3AED] text-white rounded-full font-bold flex items-center justify-center gap-2 
            transition-all duration-300 hover:scale-105 hover:bg-[#8B5CF6] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95">
            <span className="text-xl">📱</span>
            <span className="whitespace-nowrap">{t('download')}</span>
        </button>

        {/* Glass Button - Matching Width (w-56) */}
        <button className="group h-14 w-46 cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-between ps-6 pe-2 
            transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95">
            
            <span className="text-white font-medium text-lg whitespace-nowrap">
            {t('findCourt')}
            </span>

            {/* The White Circle Arrow */}
            <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-slate-900 
            transition-all duration-300 ease-in-out 
            rtl:-scale-x-100 
            group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            </div>
        </button>
        </div>
      </div>

      {/* The floating info bar at the bottom */}
        <InfoBar/>
    </section>
  );
}