import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../../types/product';

const STORAGE_KEY = 'brand-manager-products';

// Initial products data
const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Basic Training Package',
    image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=300&h=300&fit=crop&auto=format',
    price: 100,
    taxEligible: true,
    status: 'active',
    inventory: 'unlimited',
  },
  {
    id: 2,
    name: 'Professional Course Bundle',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=300&h=300&fit=crop&auto=format',
    price: 200,
    taxEligible: false,
    status: 'active',
    inventory: 'unlimited',
  },
  {
    id: 3,
    name: 'Enterprise Solution Package',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=300&fit=crop&auto=format',
    price: 300,
    taxEligible: false,
    status: 'draft',
    inventory: 'unlimited',
  },
];

// Initialize localStorage with default products if empty
const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  }
};

// Simulated API calls with localStorage persistence
const fetchProducts = async (): Promise<Product[]> => {
  initializeStorage();
  await new Promise(resolve => setTimeout(resolve, 500));
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export function useProducts() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newProduct = {
        ...product,
        id: Math.max(0, ...products.map(p => p.id)) + 1,
      };
      const updatedProducts = [...products, newProduct];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      return newProduct;
    },
    onSuccess: (newProduct) => {
      queryClient.setQueryData(['products'], (old: Product[] = []) => [...old, newProduct]);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (product: Product) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedProducts = products.map(p => 
        p.id === product.id ? product : p
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      return product;
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['products'], (old: Product[] = []) => 
        old.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
    },
  });

  return {
    products,
    isLoading,
    createProduct,
    updateProduct,
  };
}