import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { X, User, Phone, Mail, ChevronDown, Calendar } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courtName: string;
  price: number;
}

const BookingModal = ({ isOpen, onClose, courtName, price }: BookingModalProps) => {
  const t = useTranslations('BookingModal');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // Calculations
  const taxRate = 0.15;
  const taxAmount = price * taxRate;
  const totalAmount = price + taxAmount;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                  {isRtl ? 'حجز عبر الموقع' : 'Book via Web'}
                </h2>
                <p className="text-slate-400 text-sm mt-1">{courtName}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 px-1">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={isRtl ? 'الاسم الثلاثي' : 'Full Name'}
                    className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#7C3AED] outline-none text-slate-800"
                  />
                  <User className={`absolute top-1/2 -translate-y-1/2 text-slate-300 ${isRtl ? 'left-4' : 'right-4'}`} size={18} />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 px-1">{isRtl ? 'رقم الجوال' : 'Mobile Number'}</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    placeholder="05xxxxxxxx"
                    className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#7C3AED] outline-none text-slate-800"
                  />
                  <Phone className={`absolute top-1/2 -translate-y-1/2 text-slate-300 ${isRtl ? 'left-4' : 'right-4'}`} size={18} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 px-1">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="example@mail.com"
                    className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#7C3AED] outline-none text-slate-800"
                  />
                  <Mail className={`absolute top-1/2 -translate-y-1/2 text-slate-300 ${isRtl ? 'left-4' : 'right-4'}`} size={18} />
                </div>
              </div>

              {/* City & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 px-1">{isRtl ? 'المدينة' : 'City'}</label>
                  <div className="relative">
                    <select className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-4 appearance-none outline-none text-slate-500 text-sm">
                      <option>{isRtl ? 'اختر المدينة' : 'Where do you live'}</option>
                    </select>
                    <ChevronDown className={`absolute top-1/2 -translate-y-1/2 text-[#7C3AED] ${isRtl ? 'left-4' : 'right-4'}`} size={18} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 px-1">{isRtl ? 'التاريخ' : 'Date'}</label>
                  <div className="w-full bg-[#F8FAFC] rounded-2xl py-4 px-4 h-[56px]" />
                </div>
              </div>

              {/* Price Summary Card */}
              <div className="bg-[#F8FAFC] rounded-[24px] p-5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{isRtl ? 'سعر الحجز' : 'Booking Price'}</span>
                  <span className="text-slate-900 font-bold">{price} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{isRtl ? 'الضريبة (15%)' : 'Tax (15%)'}</span>
                  <span className="text-slate-900 font-bold">{taxAmount.toFixed(2)} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-slate-900 font-bold text-lg">{isRtl ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-[#7C3AED] font-bold text-xl">{totalAmount.toFixed(2)} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#6D28D9] transition-all active:scale-[0.98] shadow-lg shadow-purple-100 mt-2">
                {isRtl ? 'تأكيد الحجز والدفع' : 'Confirm & Pay'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;