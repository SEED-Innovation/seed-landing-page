import { z } from "zod";

export const BookingSchema = z.object({
  fullName: z.string().min(3, "Name is too short"),
  phoneNumber: z.string().regex(/^(05)\d{8}$/, "Invalid Saudi number (05xxxxxxxx)"),
  email: z.string().email("Invalid email"),
  city: z.string().min(1, "Please select a city"),
  bookingDate: z.string().refine((date) => {
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, { message: "Date cannot be in the past" }),
});

export type BookingData = z.infer<typeof BookingSchema>;