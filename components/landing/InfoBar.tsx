import { useTranslations } from 'next-intl';

export default function InfoBar() {
  const t = useTranslations('LandingPage.Hero.infoBar');

  const items = [
    {
      title: t('find'),
      desc: t('findDesc'),
      icon: (
        <svg className="w-5 h-5 text-[#C27AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" strokeWidth="2.5" />
          <path d="M21 21l-4.35-4.35" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: t('book'),
      desc: t('bookDesc'),
      icon: (
        <svg className="w-5 h-5 text-[#C27AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: t('play'),
      desc: t('playDesc'),
      icon: (
        <svg className="w-5 h-5 text-[#C27AFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2.5" />
          <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className="absolute bottom-[-50] md:bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[80%] max-w-8xl z-30 mt-6 md:mt-0">
      <div className="bg-[#0F172A] border border-white/10 rounded-2xl md:rounded-3xl p-5 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 px-4 group cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg group-hover:bg-[#C27AFF]/40 transition-colors">
                  {item.icon}
                </span>
                <h3 className="text-[#C27AFF] font-bold text-lg">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ps-12">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}