import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBrands } from '../../lib/hooks/useBrands';
import { Brand } from '../../types/brand';
import BrandList from '../../components/brands/BrandList';
import BrandDialog from '../../components/brands/BrandDialog';

export default function Brands() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>();
  const { brands, isLoading, createBrand, updateBrand } = useBrands();

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: Omit<Brand, 'id'> | Brand) => {
    if ('id' in data) {
      await updateBrand.mutateAsync(data);
    } else {
      await createBrand.mutateAsync(data);
    }
    setDialogOpen(false);
    setEditingBrand(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Brands</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your brands and their integration settings
          </p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              setEditingBrand(undefined);
              setDialogOpen(true);
            }}
            className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4" />
            Add Brand
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <BrandList brands={brands} isLoading={isLoading} onEdit={handleEdit} />
      </div>

      <BrandDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingBrand(undefined);
        }}
        onSubmit={handleSubmit}
        brand={editingBrand}
      />
    </div>
  );
}