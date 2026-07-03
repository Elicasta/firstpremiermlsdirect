import { z } from "zod";

export const sellerInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  mailingAddress: z.string().min(5, "Mailing address is required"),
  isLegalOwner: z.enum(["yes", "no"]),
  coOwnerName: z.string().optional(),
  preferredContactMethod: z.enum(["email", "phone", "text"])
});

export const propertyInfoSchema = z.object({
  propertyAddress: z.string().min(5, "Property address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Use 2-letter state code"),
  zip: z.string().min(5, "Enter a valid zip code"),
  propertyType: z.string().min(1, "Select a property type"),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  squareFeet: z.coerce.number().int().min(1, "Square footage is required"),
  lotSize: z.string().optional(),
  yearBuilt: z.coerce.number().int().optional(),
  hoa: z.enum(["yes", "no"]),
  hoaAmount: z.coerce.number().optional(),
  propertyTaxes: z.coerce.number().optional(),
  occupancyStatus: z.string().min(1, "Select occupancy status"),
  desiredListingPrice: z.coerce.number().min(1, "Listing price is required"),
  buyerAgentCompensation: z.string().optional(),
  showingInstructions: z.string().min(1, "Showing instructions are required"),
  lockboxDetails: z.string().optional(),
  gateAccess: z.string().optional()
});

export const listingCopySchema = z.object({
  propertyHighlights: z.string().optional(),
  upgrades: z.string().optional(),
  appliancesIncluded: z.string().optional(),
  parking: z.string().optional(),
  communityFeatures: z.string().optional(),
  schoolInfo: z.string().optional(),
  exclusions: z.string().optional()
});

export const photoSessionSchema = z.object({
  method: z.enum(["upload", "schedule"]),
  requestedDates: z.array(z.string()).optional(),
  bestTimeOfDay: z.string().optional(),
  accessNotes: z.string().optional()
});

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required")
});

export const intakeFormSchema = z.object({
  seller: sellerInfoSchema,
  property: propertyInfoSchema,
  listingCopy: listingCopySchema,
  photos: photoSessionSchema,
  packageSlug: z.enum(["basic", "standard", "premium"])
});

export type IntakeFormData = z.infer<typeof intakeFormSchema>;
