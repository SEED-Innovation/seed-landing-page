import { z } from "zod";

// Base fields common to all forms
const baseSchema = z.object({
  contactPerson: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  mobile: z.string().regex(/^05\d{8}$/, "Must be 05xxxxxxxx"),
  details: z.string().optional(),
});

export const EmployeesSchema = baseSchema.extend({
  companyName: z.string().min(2),
  employeesCount: z.string().min(1),
});

export const PartnersSchema = baseSchema.extend({
  entityName: z.string().min(2),
  partnerType: z.string().min(2),
});

export const OwnersSchema = baseSchema.extend({
  facilityName: z.string().min(2),
  city: z.string().min(1),
  courtsCount: z.coerce.number().min(1),
});