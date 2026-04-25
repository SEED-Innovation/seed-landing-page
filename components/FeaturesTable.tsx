"use client";

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import SectionBadge from '@/components/ui/SectionBadge';
import SectionTitle from '@/components/ui/SectionTitle';
import {
  CalendarCheck, DollarSign, BarChart3, Layers,
  Users, Clock, CreditCard, Smartphone, BrainCircuit,
  Bell, FileText, Headphones, LogIn, MapPin, Megaphone,
  MessageCircle, Check,
} from 'lucide-react';

const FEATURES = [
  { key: 'booking',       Icon: CalendarCheck  },
  { key: 'revenue',       Icon: DollarSign     },
  { key: 'analytics',     Icon: BarChart3      },
  { key: 'multicourt',    Icon: Layers         },
  { key: 'customers',     Icon: Users          },
  { key: 'scheduling',    Icon: Clock          },
  { key: 'payments',      Icon: CreditCard     },
  { key: 'mobile',        Icon: Smartphone     },
  { key: 'ai',            Icon: BrainCircuit   },
  { key: 'notifications', Icon: Bell           },
  { key: 'reports',       Icon: FileText       },
  { key: 'support',       Icon: Headphones     },
  { key: 'qr',            Icon: LogIn          },
  { key: 'discovery',     Icon: MapPin         },
  { key: 'marketing',     Icon: Megaphone      },
  { key: 'whatsapp',      Icon: MessageCircle  },
] as const;

export default function FeaturesTable() {
  const t = useTranslations('BusinessPage.FeaturesTable');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12 font-saudia">
          <SectionBadge>{t('badge')}</SectionBadge>
          <SectionTitle>{t('title')}</SectionTitle>
          <p className="text-[#62748E] text-lg max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Table */}
        <div className="rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
          {FEATURES.map(({ key, Icon }, idx) => (
            <div
              key={key}
              className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-[#F8F5FF]
                ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                ${idx !== FEATURES.length - 1 ? 'border-b border-slate-100' : ''}
                ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}
              `}
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-xl bg-[#F3EEFF] flex items-center justify-center shrink-0">
                <Icon size={17} className="text-[#7c55cc]" />
              </div>

              {/* Feature name */}
              <div className={`flex-1 ${isRtl ? 'pr-1' : 'pl-1'}`}>
                <span className="font-bold text-sm text-[#0F172A]">
                  {t(`features.${key}.title`)}
                </span>
                <span className={`text-xs text-[#62748E] block mt-0.5`}>
                  {t(`features.${key}.desc`)}
                </span>
              </div>

              {/* Check */}
              <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
                <Check size={13} className="text-[#16A34A]" strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 mt-10">
          <p className="text-sm text-slate-400">{t('subscriptionNote')}</p>
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
