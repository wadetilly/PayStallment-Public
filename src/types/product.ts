export interface Product {
  id: number;
  name: string;
  image?: string;
  price: number;
  taxEligible: boolean;
  status: 'active' | 'draft' | 'archived';
  inventory: 'unlimited' | number;
}