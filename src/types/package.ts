export interface PackageProduct {
  productId: number;
  type: 'core' | 'addon';
  addonConfig?: {
    allowQuantity: boolean;
    splitPayments: boolean;
  };
}

export interface PackagePricing {
  id: number;
  name: string;
  payments: number;
  amount: number;
  financeFee: number;
  interval: {
    value: number;
    unit: 'days' | 'months' | 'years';
  };
}

export interface ShippingOption {
  id: number;
  name: string;
  rate: number;
  estimatedDays?: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  brandId: number;
  products: PackageProduct[];
  pricing: PackagePricing[];
  shipping: {
    required: boolean;
    options: ShippingOption[];
  };
  bundleDiscount: {
    enabled: boolean;
    type: 'percentage' | 'fixed';
    value: number;
  };
  status: 'draft' | 'active' | 'archived';
  customFields: {
    enabled: boolean;
    fields: Array<{
      name: string;
      required: boolean;
    }>;
  };
  redirectUrl?: string;
  slug: string;
}