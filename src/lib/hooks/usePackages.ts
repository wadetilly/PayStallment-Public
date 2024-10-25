import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package } from '../../types/package';

const STORAGE_KEY = 'brand-manager-packages';

// Default package example
const defaultPackages: Package[] = [
  {
    id: 1,
    name: "Business Starter Bundle",
    description: "Complete business startup package with essential training and resources",
    brandId: 1,
    products: [
      {
        productId: 1,
        type: 'core',
      },
      {
        productId: 2,
        type: 'core',
      },
      {
        productId: 3,
        type: 'addon',
        addonConfig: {
          allowQuantity: true,
          splitPayments: false,
        },
      },
    ],
    pricing: [
      {
        id: 1,
        name: "Single Payment",
        payments: 1,
        amount: 500,
        financeFee: 0,
        interval: {
          value: 1,
          unit: 'days'
        }
      },
      {
        id: 2,
        name: "4 Monthly Payments",
        payments: 4,
        amount: 540,
        financeFee: 40,
        interval: {
          value: 1,
          unit: 'months'
        }
      },
      {
        id: 3,
        name: "8 Monthly Payments",
        payments: 8,
        amount: 580,
        financeFee: 80,
        interval: {
          value: 1,
          unit: 'months'
        }
      }
    ],
    shipping: {
      required: true,
      options: [
        {
          id: 1,
          name: "Standard Shipping",
          rate: 12,
          estimatedDays: "5-7 business days"
        },
        {
          id: 2,
          name: "Express Shipping",
          rate: 24,
          estimatedDays: "2-3 business days"
        }
      ]
    },
    bundleDiscount: {
      enabled: true,
      type: 'fixed',
      value: 100
    },
    status: 'active',
    customFields: {
      enabled: true,
      fields: [
        {
          name: "Company Name",
          required: true
        },
        {
          name: "Industry",
          required: false
        }
      ]
    },
    redirectUrl: "https://example.com/thank-you",
    slug: "business-starter-bundle"
  }
];

// Initialize localStorage with default packages if empty
const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPackages));
  }
};

// Reset storage to default packages
const resetStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPackages));
};

// Simulated API calls with localStorage persistence
const fetchPackages = async (): Promise<Package[]> => {
  initializeStorage();
  await new Promise(resolve => setTimeout(resolve, 500));
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export function usePackages() {
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: fetchPackages,
  });

  const createPackage = useMutation({
    mutationFn: async (pkg: Omit<Package, 'id'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newPackage = {
        ...pkg,
        id: Math.max(0, ...packages.map(p => p.id)) + 1,
      };
      const updatedPackages = [...packages, newPackage];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPackages));
      return newPackage;
    },
    onSuccess: (newPackage) => {
      queryClient.setQueryData(['packages'], (old: Package[] = []) => [...old, newPackage]);
    },
  });

  const updatePackage = useMutation({
    mutationFn: async (pkg: Package) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedPackages = packages.map(p => 
        p.id === pkg.id ? pkg : p
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPackages));
      return pkg;
    },
    onSuccess: (updatedPackage) => {
      queryClient.setQueryData(['packages'], (old: Package[] = []) => 
        old.map(p => p.id === updatedPackage.id ? updatedPackage : p)
      );
    },
  });

  const deletePackage = useMutation({
    mutationFn: async (id: number) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedPackages = packages.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPackages));
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(['packages'], (old: Package[] = []) => 
        old.filter(p => p.id !== id)
      );
    },
  });

  // Reset packages to default
  useEffect(() => {
    if (packages.length === 0) {
      resetStorage();
      queryClient.invalidateQueries({ queryKey: ['packages'] });
    }
  }, [packages.length, queryClient]);

  return {
    packages,
    isLoading,
    createPackage,
    updatePackage,
    deletePackage,
  };
}