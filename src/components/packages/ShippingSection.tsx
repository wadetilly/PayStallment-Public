import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Package } from '../../types/package';

interface ShippingSectionProps {
  shipping: Package['shipping'];
  onChange: (shipping: Package['shipping']) => void;
}

export function ShippingSection({ shipping, onChange }: ShippingSectionProps) {
  const addShippingOption = () => {
    const newOption = {
      id: Date.now(),
      name: '',
      rate: 0,
      estimatedDays: '',
    };
    onChange({
      ...shipping,
      options: [...shipping.options, newOption],
    });
  };

  const removeShippingOption = (id: number) => {
    onChange({
      ...shipping,
      options: shipping.options.filter(option => option.id !== id),
    });
  };

  const updateShippingOption = (id: number, updates: Partial<Package['shipping']['options'][0]>) => {
    onChange({
      ...shipping,
      options: shipping.options.map(option =>
        option.id === id ? { ...option, ...updates } : option
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Shipping</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            id="shippingRequired"
            checked={shipping.required}
            onChange={e => onChange({ ...shipping, required: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="shippingRequired" className="text-sm text-gray-700">
            Collect Shipping Information
          </label>
        </div>

        {shipping.required && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Shipping Options</p>
              <button
                type="button"
                onClick={addShippingOption}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </div>

            <div className="space-y-4">
              {shipping.options.map((option) => (
                <div key={option.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => updateShippingOption(option.id, { name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Standard Shipping"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rate</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={option.rate}
                        onChange={(e) => updateShippingOption(option.id, { rate: parseFloat(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                      <input
                        type="text"
                        value={option.estimatedDays || ''}
                        onChange={(e) => updateShippingOption(option.id, { estimatedDays: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., 3-5 business days"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeShippingOption(option.id)}
                      className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}