"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import CourtCard from "@/components/CourtCard";
import Search from "@/components/courts/Search";
import { useLocale } from 'next-intl';

interface FilterParams {
  query: string;
  category: string;
  city: string;
}

export default function Courts() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // Memoized data to prevent infinite loops and handle language shifts
  const ALL_COURTS = useMemo(() => [
    // --- Jeddah Courts ---
    { id: 1, name: isRtl ? "بادل كورنيش" : "Corniche Padel", location: isRtl ? "جدة - الكورنيش" : "Jeddah - Corniche", price: 200, rating: 4.8, image: "/images/court1.png", category: "padel", city: "jeddah" },
    { id: 2, name: isRtl ? "تنس المحيط" : "Ocean Tennis", location: isRtl ? "جدة - أبحر" : "Jeddah - Obhur", price: 150, rating: 4.5, image: "/images/court2.png", category: "tennis", city: "jeddah" },
    { id: 3, name: isRtl ? "أكاديمية السباحة" : "Swim Academy", location: isRtl ? "جدة - الروضة" : "Jeddah - Rawdah", price: 300, rating: 4.9, image: "/images/court3.png", category: "academies", city: "jeddah" },
    
    // --- Riyadh Courts ---
    { id: 4, name: isRtl ? "بادل الملقا" : "Malqa Padel", location: isRtl ? "الرياض - الملقا" : "Riyadh - Al Malqa", price: 250, rating: 4.9, image: "/images/court4.png", category: "padel", city: "riyadh" },
    { id: 5, name: isRtl ? "تنس النخيل" : "Nakheel Tennis", location: isRtl ? "الرياض - النخيل" : "Riyadh - Nakheel", price: 180, rating: 4.7, image: "/images/court5.png", category: "tennis", city: "riyadh" },
    { id: 6, name: isRtl ? "مركز اللياقة الداخلي" : "Indoor Fitness Hub", location: isRtl ? "الرياض - العليا" : "Riyadh - Olaya", price: 210, rating: 4.6, image: "/images/court1.png", category: "indoor", city: "riyadh" },
    { id: 7, name: isRtl ? "ملعب أرينا المفتوح" : "Arena Outdoor", location: isRtl ? "الرياض - الدرعية" : "Riyadh - Diriyah", price: 190, rating: 4.8, image: "/images/court2.png", category: "outdoor", city: "riyadh" },

    // --- Dammam & Khobar Courts ---
    { id: 8, name: isRtl ? "بادل الشاطئ" : "Beach Padel", location: isRtl ? "الدمام - الشاطئ" : "Dammam - Ash Shati", price: 220, rating: 4.8, image: "/images/court3.png", category: "padel", city: "dammam" },
    { id: 9, name: isRtl ? "أكاديمية الخبر" : "Khobar Academy", location: isRtl ? "الخبر - العزيزية" : "Khobar - Al Azizia", price: 280, rating: 5.0, image: "/images/court4.png", category: "academies", city: "khobar" },
    { id: 10, name: isRtl ? "تنس الواجهة" : "Waterfront Tennis", location: isRtl ? "الخبر - الكورنيش" : "Khobar - Corniche", price: 160, rating: 4.4, image: "/images/court5.png", category: "tennis", city: "khobar" },
    
    // --- Makkah & Madinah Courts ---
    { id: 11, name: isRtl ? "بادل مكة" : "Makkah Padel", location: isRtl ? "مكة - الشوقية" : "Makkah - Ash Shawqiyyah", price: 150, rating: 4.6, image: "/images/court1.png", category: "padel", city: "makkah" },
    { id: 12, name: isRtl ? "المجمع الرياضي" : "Sports Complex", location: isRtl ? "المدينة - باقدو" : "Madinah - Bagdo", price: 210, rating: 4.7, image: "/images/court2.png", category: "indoor", city: "madinah" },
    { id: 13, name: isRtl ? "أكاديمية الهدى" : "Al Huda Academy", location: isRtl ? "مكة - النسيم" : "Makkah - Al Naseem", price: 200, rating: 4.8, image: "/images/court3.png", category: "academies", city: "makkah" },

    // --- Abha Courts ---
    { id: 14, name: isRtl ? "ملاعب السودة" : "Soudah Courts", location: isRtl ? "أبها - السودة" : "Abha - Al Soudah", price: 190, rating: 4.8, image: "/images/court4.png", category: "outdoor", city: "abha" },
    { id: 15, name: isRtl ? "بادل الجبل" : "Mountain Padel", location: isRtl ? "أبها - الضباب" : "Abha - Al Dhabab", price: 230, rating: 4.7, image: "/images/court5.png", category: "padel", city: "abha" },

    // --- Additional Variety for Testing Filters ---
    { id: 16, name: isRtl ? "بادل سيتي" : "Padel City", location: isRtl ? "جدة - حي الشاطئ" : "Jeddah - Ash Shati", price: 240, rating: 4.9, image: "/images/court1.png", category: "padel", city: "jeddah" },
    { id: 17, name: isRtl ? "تنس الحديقة" : "Garden Tennis", location: isRtl ? "الرياض - الملقا" : "Riyadh - Al Malqa", price: 140, rating: 4.3, image: "/images/court2.png", category: "tennis", city: "riyadh" },
    { id: 18, name: isRtl ? "بادل لاونج" : "Padel Lounge", location: isRtl ? "الخبر - الراكة" : "Khobar - Rakah", price: 260, rating: 4.9, image: "/images/court3.png", category: "indoor", city: "khobar" },
    { id: 19, name: isRtl ? "أكاديمية المستقبل" : "Future Academy", location: isRtl ? "الدمام - الفرسان" : "Dammam - Al Fursan", price: 320, rating: 5.0, image: "/images/court4.png", category: "academies", city: "dammam" },
    { id: 20, name: isRtl ? "بادل الميدان" : "Maidan Padel", location: isRtl ? "مكة - بطحاء قريش" : "Makkah - Bathaa Quraish", price: 175, rating: 4.7, image: "/images/court5.png", category: "padel", city: "makkah" },
    { id: 21, name: isRtl ? "تنس طيبة" : "Taiba Tennis", location: isRtl ? "المدينة - العزيزية" : "Madinah - Aziziyah", price: 130, rating: 4.2, image: "/images/court1.png", category: "outdoor", city: "madinah" },
    { id: 22, name: isRtl ? "بادل العليا" : "Olaya Padel", location: isRtl ? "الرياض - العليا" : "Riyadh - Olaya", price: 270, rating: 4.8, image: "/images/court2.png", category: "padel", city: "riyadh" },
    { id: 23, name: isRtl ? "أكاديمية جدة" : "Jeddah Academy", location: isRtl ? "جدة - أبحر الشمالية" : "Jeddah - North Obhur", price: 290, rating: 4.9, image: "/images/court3.png", category: "academies", city: "jeddah" },
    { id: 24, name: isRtl ? "بادل الفنار" : "Fanar Padel", location: isRtl ? "الدمام - الفنار" : "Dammam - Al Fanar", price: 210, rating: 4.6, image: "/images/court4.png", category: "indoor", city: "dammam" },
    { id: 25, name: isRtl ? "تنس أبها" : "Abha Tennis Hub", location: isRtl ? "أبها - المحالة" : "Abha - Al Mahala", price: 155, rating: 4.5, image: "/images/court5.png", category: "tennis", city: "abha" },
    { id: 26, name: isRtl ? "بادل الشرق" : "East Padel", location: isRtl ? "الرياض - الرمال" : "Riyadh - Al Rimal", price: 195, rating: 4.7, image: "/images/court1.png", category: "outdoor", city: "riyadh" },
    { id: 27, name: isRtl ? "أكاديمية مكة المكرمة" : "Holy Makkah Academy", location: isRtl ? "مكة - ولي العهد" : "Makkah - Wali Al Ahd", price: 310, rating: 5.0, image: "/images/court2.png", category: "academies", city: "makkah" },
    { id: 28, name: isRtl ? "بادل النور" : "Noor Padel", location: isRtl ? "المدينة - الهجرة" : "Madinah - Al Hijra", price: 225, rating: 4.8, image: "/images/court3.png", category: "padel", city: "madinah" },
    { id: 29, name: isRtl ? "تنس الشاطئ" : "Shati Tennis", location: isRtl ? "جدة - حي الشاطئ" : "Jeddah - Ash Shati", price: 185, rating: 4.6, image: "/images/court4.png", category: "tennis", city: "jeddah" },
    { id: 30, name: isRtl ? "أكاديمية الخبر التقنية" : "Khobar Tech Academy", location: isRtl ? "الخبر - الثقبة" : "Khobar - Thuqbah", price: 275, rating: 4.9, image: "/images/court5.png", category: "academies", city: "khobar" },
  ], [isRtl]);

  const [filteredCourts, setFilteredCourts] = useState(ALL_COURTS);

  // Sync state with language changes
  useEffect(() => {
    setFilteredCourts(ALL_COURTS);
  }, [ALL_COURTS]);

  
  const handleFilterChange = useCallback(({ query, category, city }: FilterParams) => {     
      const results = ALL_COURTS.filter((court) => {
      const matchesQuery = court.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'all' || court.category === category;
      const matchesCity = city === 'all' || court.city === city;
      
      return matchesQuery && matchesCategory && matchesCity;
    });

    setFilteredCourts(results);
  }, [ALL_COURTS]);

  return (
    <main className="bg-[#FBFCFE] min-h-screen font-saudia">
      <Search onFilterChange={handleFilterChange} />
      
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className={`text-2xl font-bold text-[#0F172A] mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
          {isRtl ? "الملاعب المتاحة" : "Available Courts"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredCourts.length > 0 ? (
            filteredCourts.map(court => (
              <CourtCard key={court.id} {...court} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
              <p className="text-xl font-bold">{isRtl ? "لا توجد ملاعب تطابق بحثك" : "No courts match your search"}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}