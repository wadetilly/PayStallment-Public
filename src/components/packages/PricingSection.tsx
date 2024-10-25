import React from 'react';
import { PackagePricing } from '../../types/package';
import { Plus, Trash2 } from 'lucide-react';

interface PricingSectionProps {
  pricing: PackagePricing[];
  onChange: (pricing: PackagePricing[]) => void;
  totalPrice: number;
}

export function PricingSection({ pricing, onChange, totalPrice }: PricingSectionProps) {
  const addPricingOption = () => {
    const newPricing: PackagePricing = {
      id: Date.now(),
      name: `Option ${pricing.length + 1}`,
      payments: 1,
      amount: totalPrice,
      financeFee: 0,
      interval: {
        value: 1,
        unit: 'months'
      }
    };
    onChange([...pricing, newPricing]);
  };

  const removePricingOption = (id: number) => {
    onChange(pricing.filter(p => p.id !== id));
  };

  const updatePricingOption = (id: number, updates: Partial<PackagePricing>) => {
    onChange(pricing.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const calculatePaymentAmount = (option: PackagePricing) => {
    const baseAmount = (totalPrice + option.financeFee) / option.payments;
    return baseAmount.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Pricing Options</h3>
        <button
          type="button"
          onClick={addPricingOption}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Option
        </button>
      </div>

      <div className="space-y-4">
        {pricing.map((option) => (
          <div key={option.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={option.name}
                onChange={(e) => updatePricingOption(option.id, { name: e.target.value })}
                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Option Name"
              />
              <button
                type="button"
                onClick={() => removePricingOption(option.id)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Payments</label>
                <input
                  type="number"
                  min="1"
                  value={option.payments}
                  onChange={(e) => updatePricingOption(option.id, { payments: parseInt(e.target.value) || 1 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Finance Fee</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={option.financeFee}
                  onChange={(e) => updatePricingOption(option.id, { financeFee: parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interval Value</label>
                <input
                  type="number"
                  min="1"
                  value={option.interval.value}
                  onChange={(e) => updatePricingOption(option.id, { 
                    interval: { ...option.interval, value: parseInt(e.target.value) || 1 }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Interval Unit</label>
                <select
                  value={option.interval.unit}
                  onChange={(e) => updatePricingOption(option.id, { 
                    interval: { ...option.interval, unit: e.target.value as 'days' | 'months' | 'years' }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Payment Amount: ${calculatePaymentAmount(option)} × {option.payments} payments
              {option.financeFee > 0 && ` (includes $${option.financeFee.toFixed(2)} finance fee)`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}