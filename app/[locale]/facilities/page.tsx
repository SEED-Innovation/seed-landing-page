"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import CourtCard from "@/components/CourtCard";
import Search from "@/components/courts/Search";
import { useLocale } from 'next-intl';

export default function Courts() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [facilities, setFacilities] = useState<any[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`${BASE_URL}/facilities`);
        const data = await response.json();

        const facilitiesData = data.data || data || [];

        setFacilities(facilitiesData);
        setFilteredFacilities(facilitiesData);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, [BASE_URL]);

  // Build a deduplicated city list from facilities that have cityEn set
  const availableCities = useMemo(() => {
    const seen = new Set<string>();
    const result: { en: string; ar: string }[] = [];
    for (const f of facilities) {
      if (f.cityEn && !seen.has(f.cityEn)) {
        seen.add(f.cityEn);
        result.push({ en: f.cityEn, ar: f.cityAr || f.cityEn });
      }
    }
    return result;
  }, [facilities]);

  const handleFilterChange = useCallback(({ query, category, city }: any) => {
    const results = facilities.filter((facility) => {
      const nameMatch = isRtl ? (facility.nameAr || facility.name) : facility.name;
      const matchesQuery = nameMatch.toLowerCase().includes(query.toLowerCase()) ||
                           (facility.location || '').toLowerCase().includes(query.toLowerCase());

      const matchesCategory = category === 'all' || facility.courts?.some((c: any) =>
        c.sportType?.toLowerCase() === category.toLowerCase()
      );

      // city filter key is always the English city name
      const matchesCity = city === 'all' || facility.cityEn === city;

      return matchesQuery && matchesCategory && matchesCity;
    });

    setFilteredFacilities(results);
  }, [facilities, isRtl]);

  return (
    <main className="bg-[#FBFCFE] min-h-screen font-saudia">
      <Search onFilterChange={handleFilterChange} cities={availableCities} />
      
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {!isLoading ? filteredFacilities.map(facility => (
            <CourtCard
              key={facility.id}
              id={facility.courts[0]?.id || facility.id}
              facilityId={facility.id}
              name={isRtl ? facility.nameAr : facility.name}
              facilityName={isRtl ? facility.nameAr : facility.name}
              location={isRtl ? (facility.locationAr ?? facility.location) : facility.location}
              price={(() => {
                const prices = facility.courts
                  .map((c: any) => c.hourlyFee)
                  .filter((p: number) => p > 0);
                return prices.length > 0 ? Math.min(...prices) : 0;
              })()}
              startingFrom={(() => {
                const prices = facility.courts
                  .map((c: any) => c.hourlyFee)
                  .filter((p: number) => p > 0);
                return new Set(prices).size > 1;
              })()}
              image={facility.imageUrl || '/images/court3.png'}
              rating={facility.averageRating || 4.8}
              category={facility.courts[0]?.sportType || "TENNIS"}
              onboarding={facility.onboarding === true}
            />
          )) : (
             <div className="col-span-full flex justify-center py-20">
                <p className="animate-pulse text-slate-400">{isRtl ? "جاري تحميل المرافق..." : "Loading facilities..."}</p>
             </div>
          )}
        </div>
      </div>
    </main>
  );
}