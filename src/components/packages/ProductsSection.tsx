import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PackageProduct } from '../../types/package';
import { Product } from '../../types/product';
import { cn } from '../../lib/utils';

interface ProductsSectionProps {
  products: PackageProduct[];
  availableProducts: Product[];
  onChange: (products: PackageProduct[]) => void;
  type: 'core' | 'addon';
}

export function ProductsSection({ products, availableProducts, onChange, type }: ProductsSectionProps) {
  const filteredProducts = products.filter(p => p.type === type);
  const title = type === 'core' ? 'Core Products' : 'Add-on Products';
  const buttonText = type === 'core' ? 'Add Core Product' : 'Add Optional Product';

  const addProduct = () => {
    const newProduct: PackageProduct = {
      productId: availableProducts[0]?.id || 0,
      type,
      ...(type === 'addon' && {
        addonConfig: {
          allowQuantity: false,
          splitPayments: false,
        },
      }),
    };
    onChange([...products, newProduct]);
  };

  const removeProduct = (productId: number) => {
    onChange(products.filter(p => p.productId !== productId));
  };

  const getProductDetails = (productId: number) => {
    return availableProducts.find(p => p.id === productId);
  };

  const updateAddonConfig = (product: PackageProduct, updates: Partial<PackageProduct['addonConfig']>) => {
    const newProducts = products.map(p =>
      p === product ? {
        ...p,
        addonConfig: {
          ...p.addonConfig,
          ...updates,
        },
      } : p
    );
    onChange(newProducts);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addProduct}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4" />
          {buttonText}
        </button>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product, index) => {
          const productDetails = getProductDetails(product.productId);
          return (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <select
                    value={product.productId}
                    onChange={e => {
                      const newProducts = products.map(p =>
                        p === product ? { ...p, productId: parseInt(e.target.value) } : p
                      );
                      onChange(newProducts);
                    }}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {availableProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeProduct(product.productId)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {productDetails && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div>Price: ${productDetails.price.toFixed(2)}</div>
                    <div>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                          productDetails.taxEligible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {productDetails.taxEligible ? 'Tax Eligible' : 'Tax Exempt'}
                      </span>
                    </div>
                  </div>

                  {type === 'addon' && (
                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={product.addonConfig?.allowQuantity || false}
                          onChange={e => updateAddonConfig(product, {
                            allowQuantity: e.target.checked,
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Allow Quantity Selection</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={product.addonConfig?.splitPayments || false}
                          onChange={e => updateAddonConfig(product, {
                            splitPayments: e.target.checked,
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Split Across Payments</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}