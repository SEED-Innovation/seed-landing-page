export interface CheckoutPayload {
  facilityId: number;
  facilityName: string;
  location: string;
  courtId: number;
  courtName: string;
  price: number;
  date: string;      // "YYYY-MM-DD"
  time: string;      // ISO datetime or "HH:MM"
  duration: number;  // hours: 1 | 1.5 | 2 | 3
  recording: boolean;
  sportType: string;
}

const CHECKOUT_KEY = 'seed-checkout';

export function writeCheckout(payload: CheckoutPayload): void {
  sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));
}

export function readCheckout(): CheckoutPayload | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_KEY);
    return raw ? (JSON.parse(raw) as CheckoutPayload) : null;
  } catch {
    return null;
  }
}

export function clearCheckout(): void {
  sessionStorage.removeItem(CHECKOUT_KEY);
}
