import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server"; // Use server-side locale getter
import { privacyContent } from "@/constants/privacy-policy";
import { termsContent } from "@/constants/terms-of-service";
import { termsOfUseContent } from "@/constants/terms-of-use";
import { refundContent } from "@/constants/refund-policy";

interface Props {
  // params must be a Promise in Next.js 15
  params: Promise<{ slug: string }>;
}

// Optional: This improves SEO and speed by pre-generating the pages at build time
export async function generateStaticParams() {
  return [
    { slug: "privacy" },
    { slug: "terms-of-service" },
    { slug: "terms-of-use" },
    { slug: "refund-policy" },
  ];
}

export default async function LegalPage({ params }: Props) {
  // 1. Await the params to get the slug
  const { slug } = await params;
  
  // 2. Await the locale (using the server-compatible function)
  const locale = (await getLocale()) as 'en' | 'ar';

  const policyMap: Record<string, any> = {
    "privacy": privacyContent,
    "terms-of-service": termsContent,
    "terms-of-use": termsOfUseContent,
    "refund-policy": refundContent,
  };

  const policyData = policyMap[slug];

  if (!policyData || !policyData[locale]) {
    notFound();
  }

  const data = policyData[locale];
  const isRtl = locale === 'ar';

  return (
    <main className="bg-white min-h-screen py-16 px-6 antialiased" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        {/* Title and Date */}
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-normal">
            {data.title}
          </h1>
          <p className="text-indigo-600 font-semibold uppercase tracking-wider">
            {data.lastUpdated}
          </p>
        </header>

        {/* Intro Section */}
        <div className="mb-16 relative">
          <div className={`absolute top-0 bottom-0 w-1 bg-indigo-500 ${isRtl ? 'right-0' : 'left-0'}`} />
          <p className={`text-lg text-gray-600 leading-relaxed italic whitespace-pre-line ${isRtl ? 'pr-6' : 'pl-6'}`}>
            {data.intro}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {data.sections.map((section: any, idx: number) => (
            <section key={idx} className="group">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-indigo-700 transition-colors">
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.content.map((para: string, pIdx: number) => (
                  <p 
                    key={pIdx} 
                    className="text-gray-700 leading-8 text-[1.05rem]"
                    dangerouslySetInnerHTML={{ 
                      // Regex to convert **bold** markers to HTML
                      __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-black font-extrabold">$1</strong>') 
                    }} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}