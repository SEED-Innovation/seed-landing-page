import { z } from "zod";

const baseSchema = z.object({
  contactPerson: z.string().min(2, "Name is too short").max(100),
  email:         z.string().email("Invalid email"),
  mobile: z.string().regex(
    /^(05\d{8}|\+9665\d{8})$/,
    "Must be 05xxxxxxxx or +9665xxxxxxxx"
  ),
});

export const EmployeesSchema = baseSchema.extend({
  companyName:    z.string().min(2).max(200),
  employeesCount: z.string().min(1),
  details:        z.string().min(10, "Details are too short").max(1500),
});

export const PartnersSchema = baseSchema.extend({
  entityName:  z.string().min(2).max(200),
  partnerType: z.string().min(2).max(100),
  details:     z.string().min(10, "Details are too short").max(1500),
});

export const OwnersSchema = baseSchema.extend({
  facilityName: z.string().min(2).max(200),
  courtsCount:  z.coerce.number().min(1).int(),
  courtType:    z.enum(['tennis', 'padel', 'both'], {
    error: "Please select a court type",   
  }),
  message:      z.string().min(10, "Message is too short").max(2000),
});