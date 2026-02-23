import { privacyContent } from "@/constants/privacy-policy";
import { notFound } from "next/navigation";
import { useLocale } from "next-intl";
export default function PrivacyPage() {
  // Validate locale
   const locale = useLocale();
  if (locale !== 'en' && locale !== 'ar') notFound();

  const data = privacyContent[locale as 'en' | 'ar'];
  const isRtl = locale === 'ar';

  return (
    <main className="bg-white min-h-screen py-16 px-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        
        {/* Title and Date */}
        <div className="mb-12 border-b pb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {data.title}
          </h1>
          <p className="text-indigo-600 font-medium">
            {data.lastUpdated}
          </p>
        </div>
        
        {/* Intro - whitespace-pre-line handles the \n\n breaks */}
        <p className="text-lg text-gray-600 mb-16 leading-relaxed italic whitespace-pre-line border-s-4 border-indigo-200 ps-6">
          {data.intro}
        </p>

        {/* Policy Sections */}
        <div className="space-y-16">
          {data.sections.map((section, idx) => (
            <section key={idx} className="group">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-indigo-700 transition-colors">
                {section.title}
              </h2>
              
              <div className="space-y-6">
                {section.content.map((para, pIdx) => (
                  <p 
                    key={pIdx} 
                    className="text-gray-700 leading-8 text-[1.05rem]"
                    dangerouslySetInnerHTML={{ 
                      // This regex converts **text** to bold <strong> tags
                      __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black font-extrabold">$1</strong>') 
                    }} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Simple Footer/Contact hint */}
        <div className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SEED Sports Technologies
          </p>
        </div>
      </div>
    </main>
  );
}