import { z } from 'zod';

// Phone number regex for US/CA format
const phoneRegex = /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

// Validation schemas
export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number'),
  companyName: z.string().optional(),
  companyPhone: z.string().regex(phoneRegex, 'Invalid company phone number').optional(),
});

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().min(1, 'Country is required'),
});

export const checkoutSchema = z.object({
  contact: contactSchema,
  billingAddress: addressSchema,
  shippingAddress: addressSchema,
  sameAsBilling: z.boolean(),
  selectedAddons: z.array(z.object({
    id: z.number(),
    quantity: z.number().min(1),
  })),
  paymentPlan: z.number(),
  shippingMethod: z.string(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Validation helper functions
export const validateField = <T extends Record<string, any>>(
  schema: z.ZodType<T>,
  field: keyof T,
  value: any
): string | null => {
  try {
    schema.shape[field as string].parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return 'Validation error';
  }
};

export const validateForm = <T extends Record<string, any>>(
  schema: z.ZodType<T>,
  data: T
): { success: boolean; errors: Partial<Record<keyof T, string>> } => {
  try {
    schema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        const path = err.path[0] as keyof T;
        acc[path] = err.message;
        return acc;
      }, {} as Partial<Record<keyof T, string>>);
      return { success: false, errors };
    }
    return { success: false, errors: {} };
  }
};