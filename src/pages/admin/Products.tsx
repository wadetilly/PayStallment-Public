import { Plus } from 'lucide-react';
import { useState } from 'react';
import ProductHeader from '../../components/products/ProductHeader';
import ProductList from '../../components/products/ProductList';
import ProductDialog from '../../components/products/ProductDialog';
import { useProducts } from '../../lib/hooks/useProducts';
import { Product } from '../../types/product';

export default function Products() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const { products, isLoading, createProduct, updateProduct } = useProducts();

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: Omit<Product, 'id'> | Product) => {
    if ('id' in data) {
      await updateProduct.mutateAsync(data);
    } else {
      await createProduct.mutateAsync(data);
    }
    setDialogOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ProductHeader />
        <div className="mt-4 sm:ml-16 sm:mt-0">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(undefined);
              setDialogOpen(true);
            }}
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <ProductList 
          products={products} 
          isLoading={isLoading} 
          onEdit={handleEdit} 
        />
      </div>

      <ProductDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingProduct(undefined);
        }}
        onSubmit={handleSubmit}
        product={editingProduct}
      />
    </div>
  );
}