import { useEffect } from 'react';
import { Package } from '../../types/package';

interface AddressFormProps {
  title: string;
  value: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  onChange: (value: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => void;
  isShipping?: boolean;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod?: string;
  onShippingMethodChange?: (method: string) => void;
  shippingOptions?: Package['shipping']['options'];
  sameAsBilling?: boolean;
  onSameAsBillingChange?: (value: boolean) => void;
}

export default function AddressForm({
  title,
  value,
  onChange,
  isShipping,
  billingAddress,
  shippingMethod,
  onShippingMethodChange,
  shippingOptions,
  sameAsBilling,
  onSameAsBillingChange,
}: AddressFormProps) {
  // Update shipping address when "same as billing" is checked
  useEffect(() => {
    if (isShipping && sameAsBilling && billingAddress) {
      onChange(billingAddress);
    }
  }, [isShipping, sameAsBilling, billingAddress, onChange]);

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      
      {isShipping && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sameAsBilling"
                checked={sameAsBilling}
                onChange={(e) => onSameAsBillingChange?.(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="sameAsBilling" className="ml-2 block text-sm text-gray-700">
                Same as billing address
              </label>
            </div>
          </div>
        </div>
      )}

      {(!isShipping || !sameAsBilling) && (
        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          <div className="sm:col-span-2">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Street address
            </label>
            <input
              type="text"
              id="street"
              value={value.street}
              onChange={e => onChange({ ...value, street: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              value={value.city}
              onChange={e => onChange({ ...value, city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State / Province
            </label>
            <input
              type="text"
              id="state"
              value={value.state}
              onChange={e => onChange({ ...value, state: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              ZIP / Postal code
            </label>
            <input
              type="text"
              id="zipCode"
              value={value.zipCode}
              onChange={e => onChange({ ...value, zipCode: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              value={value.country}
              onChange={e => onChange({ ...value, country: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              {/* Add more countries as needed */}
            </select>
          </div>
        </div>
      )}

      {isShipping && shippingOptions && shippingOptions.length > 0 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Shipping Method
          </label>
          <div className="mt-2 space-y-2">
            {shippingOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value={option.id}
                  checked={shippingMethod === String(option.id)}
                  onChange={(e) => onShippingMethodChange?.(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{option.name}</p>
                    {option.estimatedDays && (
                      <p className="text-sm text-gray-500">
                        Estimated delivery: {option.estimatedDays}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${option.rate.toFixed(2)}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}