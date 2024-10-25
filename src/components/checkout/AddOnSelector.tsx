import { usePackages } from '../../lib/hooks/usePackages';
import { useProducts } from '../../lib/hooks/useProducts';
import { Package } from '../../types/package';
import { Product } from '../../types/product';
import { Minus, Plus } from 'lucide-react';

interface AddOnSelectorProps {
  packageId: number;
  selectedAddons: Array<{ id: number; quantity: number }>;
  onAddonChange: (addons: Array<{ id: number; quantity: number }>) => void;
}

export default function AddOnSelector({ packageId, selectedAddons, onAddonChange }: AddOnSelectorProps) {
  const { packages } = usePackages();
  const { products } = useProducts();
  const pkg = packages.find(p => p.id === packageId);

  if (!pkg) return null;

  const addons = pkg.products
    .filter(p => p.type === 'addon')
    .map(p => products.find(product => product.id === p.productId))
    .filter((p): p is Product => p !== undefined);

  const getQuantity = (productId: number) => {
    return selectedAddons.find(a => a.id === productId)?.quantity || 0;
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      onAddonChange(selectedAddons.filter(a => a.id !== productId));
    } else {
      const existing = selectedAddons.find(a => a.id === productId);
      if (existing) {
        onAddonChange(
          selectedAddons.map(a => (a.id === productId ? { ...a, quantity } : a))
        );
      } else {
        onAddonChange([...selectedAddons, { id: productId, quantity }]);
      }
    }
  };

  if (addons.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">Available Add-ons</h2>
      <div className="mt-4 space-y-4">
        {addons.map(addon => {
          const packageProduct = pkg.products.find(p => p.productId === addon.id);
          const quantity = getQuantity(addon.id);

          return (
            <div
              key={addon.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center space-x-4">
                {addon.image ? (
                  <img
                    src={addon.image}
                    alt={addon.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{addon.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">${addon.price.toFixed(2)}</p>
                </div>
              </div>

              {packageProduct?.addonConfig?.allowQuantity ? (
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(addon.id, Math.max(0, quantity - 1))}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(addon.id, quantity + 1)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={quantity > 0}
                    onChange={e => updateQuantity(addon.id, e.target.checked ? 1 : 0)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Add to order</span>
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}