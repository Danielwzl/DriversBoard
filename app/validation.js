import { z } from "zod";

/**
 * Validation error fields for form re-rendering
 * @param {import("zod").ZodError} err
 */
export function fieldErrorsForForm(err) {
  return err.flatten().fieldErrors;
}

export const DriverCreateSchema = z.object({
  campaignId: z.string().min(1),
  fullName: z.string().min(2).max(200),
  email: z.string().email().max(254),
  phone: z.string().min(6).max(30),
  licenseNumber: z.string().min(3).max(50),
  licenseRegion: z.string().min(2).max(50),
});

export const VehicleCreateSchema = z.object({
  driverId: z.coerce.number().int().positive(),
  make: z.string().min(1).max(80),
  model: z.string().min(1).max(80),
  year: z.coerce.number().int().min(1900).max(2100),
  insurancePolicyNumber: z.string().min(3).max(80),
  insuranceExpiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

