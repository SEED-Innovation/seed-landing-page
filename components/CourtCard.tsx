"use client";

import { useState } from 'react';
import BookingModal from './courts/BookingModal';
import { useTranslations, useLocale } from 'next-intl';
import { Heart, Star, MapPin, CircleDot } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
interface CourtCardProps {
  name: string;
  location: string;
  price: number;
  image: string;
  rating: number;
  category:string;
}

const CourtCard = ({ name, location, price, image, rating ,category }: CourtCardProps) => {
  const t = useTranslations('CourtsPage.Discovery');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <>
    <div className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-50 hover:shadow-md transition-all group">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] mb-4">
        <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Floating Badges */}
        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'}`}>
           <span className="bg-[#7C3AED] text-white text-xs font-light px-3 py-1.5 rounded-full shadow-lg">
             {t('trend')}
           </span>
        </div>
        <button className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} bg-black/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500 transition-colors`}>
          <Heart size={18} />
        </button>

        {/* Rating & Sport Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold">
            <span>{t('rating')} {rating}</span>
            <Star size={12} className="fill-yellow-400 stroke-yellow-400" />
          </div>
          <div className="bg-white px-3 py-1 rounded-full flex items-center gap-1.5 text-[#7C3AED] text-xs font-md">
            <CircleDot size={12} />
            <span> {category}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-saudia font-bold text-lg text-[#0F172A]">{name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="font-saudia font-bold text-[#7C3AED] text-xl">{price}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t('currency')}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400 mb-6">
          <MapPin size={14} />
          <span className="text-xs font-saudia font-medium">{location}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 font-bold">
          <button className="bg-[#1E293B] text-white py-3 rounded-2xl text-xs font-saudia font-medium hover:bg-[#0F172A] transition-colors hover:cursor-pointer">
            {t('actions.app')}
          </button>
          <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7C3AED] text-white py-3 rounded-2xl text-xs font-medium hover:bg-[#6D28D9] transition-colors shadow-lg shadow-purple-100 hover:cursor-pointer">
            <Link href={"/courts"}>
            <span>{t('actions.web')}</span>
            </Link>
            
          </button>
        </div>
      </div>
    </div>
    {/* The Modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courtName={name} 
        price={price} 
      />
      </>
  );
};

export default CourtCard;