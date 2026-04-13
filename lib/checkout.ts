export interface CheckoutPayload {
  facilityId: number;
  facilityWebsite: string;
  facilityName: string;
  location: string;
  courtId: number;
  courtName: string;
  price: number;          // hourlyFee — court price per hour
  recordingFee: number;   // seedRecordingFee from court object (0 if null)
  bookingType: 'court';
  date: string;           // "YYYY-MM-DD"
  time: string;           // ISO datetime or "HH:MM"
  duration: number;       // legacy hours value for UI restore
  durationMinutes: number;
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
