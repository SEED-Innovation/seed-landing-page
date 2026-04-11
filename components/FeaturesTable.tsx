"use client";

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import SectionBadge from '@/components/ui/SectionBadge';
import SectionTitle from '@/components/ui/SectionTitle';
import {
  CalendarCheck, DollarSign, BadgePercent, BarChart3, Layers, Tag,
  Users, Clock, ShieldCheck, CreditCard, Smartphone, BrainCircuit,
  Bell, Star, ListOrdered, FileText, Headphones, QrCode, MapPin, Megaphone,
} from 'lucide-react';

const FEATURES = [
  { key: 'booking',       Icon: CalendarCheck  },
  { key: 'revenue',       Icon: DollarSign     },
  { key: 'pricing',       Icon: BadgePercent   },
  { key: 'analytics',     Icon: BarChart3      },
  { key: 'multicourt',    Icon: Layers         },
  { key: 'promotions',    Icon: Tag            },
  { key: 'customers',     Icon: Users          },
  { key: 'scheduling',    Icon: Clock          },
  { key: 'staff',         Icon: ShieldCheck    },
  { key: 'payments',      Icon: CreditCard     },
  { key: 'mobile',        Icon: Smartphone     },
  { key: 'ai',            Icon: BrainCircuit   },
  { key: 'notifications', Icon: Bell           },
  { key: 'reviews',       Icon: Star           },
  { key: 'waitlist',      Icon: ListOrdered    },
  { key: 'reports',       Icon: FileText       },
  { key: 'support',       Icon: Headphones     },
  { key: 'qr',            Icon: QrCode         },
  { key: 'discovery',     Icon: MapPin         },
  { key: 'marketing',     Icon: Megaphone      },
] as const;

export default function FeaturesTable() {
  const t = useTranslations('BusinessPage.FeaturesTable');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className={`text-center mb-14 font-saudia`}>
          <SectionBadge>{t('badge')}</SectionBadge>
          <SectionTitle>{t('title')}</SectionTitle>
          <p className="text-[#62748E] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {FEATURES.map(({ key, Icon }) => (
            <div
              key={key}
              className={`bg-white rounded-[24px] border border-slate-100 shadow-sm p-6
                          flex flex-col gap-3 transition-all duration-300
                          hover:-translate-y-1 hover:shadow-md
                          ${isRtl ? 'text-right' : 'text-left'}`}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                <Icon size={20} className="text-[#2563EB]" />
              </div>

              {/* Text */}
              <div>
                <h4 className="font-bold text-[#0F172A] text-sm leading-snug mb-1">
                  {t(`features.${key}.title`)}
                </h4>
                <p className="text-xs text-[#62748E] leading-relaxed">
                  {t(`features.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/business/owners"
            className="bg-[#2563EB] text-white rounded-2xl px-10 py-4 font-bold text-base
                       hover:bg-[#1D4ED8] transition-colors shadow-lg shadow-blue-100"
          >
            {t('cta')}
          </Link>
        </div>

      </div>
    </section>
  );
}
