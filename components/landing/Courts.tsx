import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

const Courts = () => {
  const t = useTranslations('Courts');

  // Placeholder images for the cards
  const courts = [
    {
      key: 'training',
      location: 'Jeddah',
      sessions: 'Daily Sessions',
      image: '/images/training.jpg' 
    },
    {
      key: 'padel',
      location: 'Jeddah',
      sessions: '8 Courts',
      image: '/images/padel.jpg'
    },
    {
      key: 'tennis',
      location: 'Riyadh',
      sessions: '12 Courts',
      image: '/images/tennis.jpg'
    }
  ];

return (
    <section className="relative py-20 px-6 bg-white overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute inset-x-0 top-0 h-[500px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(50% 50% at 50% 0%, #F3E8FF 0%, rgba(255, 255, 255, 0) 100%)',
          filter: 'blur(100px)' 
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <span className="text-[#7C3AED] font-bold text-lg md:text-2xl tracking-widest uppercase mb-2 block ltr:text-left rtl:text-right ">
          {t('badge')}
        </span>
        
        <div className="flex justify-between items-stretch mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] items-center">
              {t('title')}
            </h2>
          </div>
          
          {/* Added cursor-pointer and group for arrow animation */}
          <button className="group/btn flex items-center gap-2 text-gray-400 hover:text-purple-600 transition-colors font-medium text-sm md:text-base whitespace-nowrap cursor-pointer">
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div 
              key={court.key}
              className="group relative h-[450px] rounded-[32px] overflow-hidden bg-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              
              {/* Image Placeholder with zoom */}
              <div className="absolute inset-0 bg-gray-300 group-hover:scale-110 transition-transform duration-700" />

              <div className="absolute bottom-0 inset-x-0 p-8 z-20 flex flex-col items-start text-white ltr:text-left rtl:text-right">
                <div className="flex items-center gap-4 text-xs font-light mb-2 opacity-80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {court.location}
                  </span>
                  <span className="w-1 h-1 bg-white rounded-full" />
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {court.sessions}
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {t(`items.${court.key}.name`)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courts;