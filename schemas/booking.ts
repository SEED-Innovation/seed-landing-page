import { z } from "zod";
import { CalendarDate } from "@internationalized/date";

export const BookingSchema = z.object({
  fullName: z.string().min(3, "Name is too short"),
  phoneNumber: z.string().regex(/^(05)\d{8}$/, "Invalid Saudi number (05xxxxxxxx)"),
  email: z.string().email("Invalid email"),
  city: z.string().min(1, "Please select a city"),
  // Directly use the HeroUI CalendarDate type
  bookingDate: z.instanceof(CalendarDate, { message: "Please select a date" }),
  timeSlot: z.string().min(1, "Please select a time slot"),
});

export type BookingData = z.infer<typeof BookingSchema>;