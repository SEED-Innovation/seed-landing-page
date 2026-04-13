import PaymentCompleteClient from '@/components/checkout/PaymentCompleteClient';

interface PaymentCompletePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order_id?: string }>;
}

export default async function PaymentCompletePage({
  params,
  searchParams,
}: PaymentCompletePageProps) {
  const [{ locale }, search] = await Promise.all([params, searchParams]);
  return (
    <PaymentCompleteClient
      orderId={search.order_id ?? ''}
      homeHref={`/${locale}`}
    />
  );
}
