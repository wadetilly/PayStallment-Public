import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Brand {
  id: number;
  name: string;
  logo?: string;
  stripeSecretKey?: string;
  stripePublicKey?: string;
  stripeTestSecretKey?: string;
  stripeTestPublicKey?: string;
  defaultTaxRate: number;
  sendgridApiKey?: string;
  defaultEmail?: string;
}

const STORAGE_KEY = 'brand-manager-brands';

const defaultBrands: Brand[] = [
  {
    id: 1,
    name: 'Default Brand',
    defaultTaxRate: 0,
  },
];

const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBrands));
  }
};

const fetchBrands = async (): Promise<Brand[]> => {
  initializeStorage();
  await new Promise(resolve => setTimeout(resolve, 500));
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export function useBrands() {
  const queryClient = useQueryClient();

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });

  const createBrand = useMutation({
    mutationFn: async (brand: Omit<Brand, 'id'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newBrand = {
        ...brand,
        id: Math.max(0, ...brands.map(b => b.id)) + 1,
      };
      const updatedBrands = [...brands, newBrand];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBrands));
      return newBrand;
    },
    onSuccess: (newBrand) => {
      queryClient.setQueryData(['brands'], (old: Brand[] = []) => [...old, newBrand]);
    },
  });

  const updateBrand = useMutation({
    mutationFn: async (brand: Brand) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedBrands = brands.map(b => 
        b.id === brand.id ? brand : b
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBrands));
      return brand;
    },
    onSuccess: (updatedBrand) => {
      queryClient.setQueryData(['brands'], (old: Brand[] = []) => 
        old.map(b => b.id === updatedBrand.id ? updatedBrand : b)
      );
    },
  });

  return {
    brands,
    isLoading,
    createBrand,
    updateBrand,
  };
}