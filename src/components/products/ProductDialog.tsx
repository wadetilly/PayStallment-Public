import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types/product';
import { cn } from '../../lib/utils';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id'> | Product) => void;
  product?: Product;
}

export default function ProductDialog({ open, onClose, onSubmit, product }: ProductDialogProps) {
  const [formData, setFormData] = React.useState<Partial<Product>>({
    name: '',
    price: 0,
    taxEligible: true,
    status: 'draft',
    inventory: 'unlimited',
  });

  // Reset form data when product changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData(product || {
        name: '',
        price: 0,
        taxEligible: true,
        status: 'draft',
        inventory: 'unlimited',
      });
    }
  }, [open, product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSubmit({ ...formData, id: product.id } as Product);
    } else {
      onSubmit(formData as Omit<Product, 'id'>);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white p-6 sm:max-w-xl sm:rounded-l-xl sm:border-l">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{product ? 'Edit Product' : 'New Product'}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name || ''}
              onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={formData.price || 0}
              onChange={e => setFormData(d => ({ ...d, price: parseFloat(e.target.value) }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              value={formData.image || ''}
              onChange={e => setFormData(d => ({ ...d, image: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="taxEligible"
                checked={formData.taxEligible || false}
                onChange={e => setFormData(d => ({ ...d, taxEligible: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="taxEligible" className="ml-2 block text-sm text-gray-700">
                Tax Eligible
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status || 'draft'}
              onChange={e => setFormData(d => ({ ...d, status: e.target.value as Product['status'] }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}