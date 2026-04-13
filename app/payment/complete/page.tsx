import { redirect } from 'next/navigation';

interface UnlocalizedPaymentCompletePageProps {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function UnlocalizedPaymentCompletePage({
  searchParams,
}: UnlocalizedPaymentCompletePageProps) {
  const search = await searchParams;
  const orderId = search.order_id ? `?order_id=${encodeURIComponent(search.order_id)}` : '';
  redirect(`/en/payment/complete${orderId}`);
}
