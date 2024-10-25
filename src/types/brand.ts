export interface Brand {
  id: number;
  name: string;
  logo?: string;
  email: string;
  sendgridKey: string;
  stripeKeys: {
    test: {
      publishable: string;
      secret: string;
    };
    live: {
      publishable: string;
      secret: string;
    };
  };
  taxjarKeys: {
    test: string;
    live: string;
  };
  defaultTaxRate: number;
  status: 'active' | 'inactive';
}