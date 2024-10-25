import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Package } from '../../types/package';
import { useBrands } from '../../lib/hooks/useBrands';
import { useProducts } from '../../lib/hooks/useProducts';
import { ProductsSection } from './ProductsSection';
import { PricingSection } from './PricingSection';
import { ShippingSection } from './ShippingSection';

interface PackageDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Package) => void;
  package?: Package;
}

const defaultFormData: Partial<Package> = {
  name: '',
  description: '',
  products: [],
  pricing: [],
  shipping: {
    required: false,
    options: [],
  },
  bundleDiscount: {
    enabled: false,
    type: 'percentage',
    value: 0,
  },
  status: 'draft',
  customFields: {
    enabled: false,
    fields: [],
  },
  slug: '',
};

export default function PackageDialog({ open, onClose, onSubmit, package: pkg }: PackageDialogProps) {
  const { brands } = useBrands();
  const { products } = useProducts();
  const [formData, setFormData] = useState<Partial<Package>>(defaultFormData);

  // Reset form data when package changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData(pkg ? { ...pkg } : { ...defaultFormData, brandId: brands[0]?.id || 1 });
    }
  }, [open, pkg, brands]);

  const calculateTotalPrice = () => {
    const coreProducts = (formData.products || [])
      .filter(p => p.type === 'core')
      .reduce((total, { productId }) => {
        const product = products.find(p => p.id === productId);
        return total + (product?.price || 0);
      }, 0);

    if (formData.bundleDiscount?.enabled) {
      const discount = formData.bundleDiscount.type === 'percentage'
        ? coreProducts * (formData.bundleDiscount.value / 100)
        : formData.bundleDiscount.value;
      return coreProducts - discount;
    }

    return coreProducts;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Package);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white p-6 sm:max-w-xl sm:rounded-l-xl sm:border-l">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {pkg ? 'Edit Package' : 'Create Package'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Package Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name || ''}
                onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description || ''}
                onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <select
                id="brand"
                value={formData.brandId}
                onChange={e => setFormData(d => ({ ...d, brandId: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-2 space-x-4">
                {(['draft', 'active', 'archived'] as const).map((status) => (
                  <label key={status} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={e => setFormData(d => ({ ...d, status: e.target.value as Package['status'] }))}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Core Products */}
          <ProductsSection
            products={formData.products || []}
            availableProducts={products}
            onChange={products => setFormData(d => ({ ...d, products }))}
            type="core"
          />

          {/* Add-on Products */}
          <ProductsSection
            products={formData.products || []}
            availableProducts={products}
            onChange={products => setFormData(d => ({ ...d, products }))}
            type="addon"
          />

          {/* Bundle Discount */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Bundle Discount</h3>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="bundleDiscountEnabled"
                checked={formData.bundleDiscount?.enabled || false}
                onChange={e => setFormData(d => ({
                  ...d,
                  bundleDiscount: {
                    ...d.bundleDiscount,
                    enabled: e.target.checked,
                  },
                }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="bundleDiscountEnabled" className="text-sm text-gray-700">
                Enable Bundle Discount
              </label>
            </div>

            {formData.bundleDiscount?.enabled && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount Type
                  </label>
                  <select
                    value={formData.bundleDiscount?.type || 'percentage'}
                    onChange={e => setFormData(d => ({
                      ...d,
                      bundleDiscount: {
                        ...d.bundleDiscount,
                        type: e.target.value as 'percentage' | 'fixed',
                      },
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.bundleDiscount?.type === 'percentage' ? 'Discount %' : 'Discount Amount'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step={formData.bundleDiscount?.type === 'percentage' ? '1' : '0.01'}
                    value={formData.bundleDiscount?.value || 0}
                    onChange={e => setFormData(d => ({
                      ...d,
                      bundleDiscount: {
                        ...d.bundleDiscount,
                        value: parseFloat(e.target.value),
                      },
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing Options */}
          <PricingSection
            pricing={formData.pricing || []}
            onChange={pricing => setFormData(d => ({ ...d, pricing }))}
            totalPrice={calculateTotalPrice()}
          />

          {/* Shipping Options */}
          <ShippingSection
            shipping={formData.shipping}
            onChange={shipping => setFormData(d => ({ ...d, shipping }))}
          />

          {/* Form Actions */}
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
              {pkg ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}