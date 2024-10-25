import { usePackages } from '../../lib/hooks/usePackages';
import { useProducts } from '../../lib/hooks/useProducts';

interface OrderSummaryProps {
  packageId: number;
  selectedAddons: Array<{ id: number; quantity: number }>;
  selectedPaymentPlan: number | null;
  shippingMethod: string;
}

export default function OrderSummary({
  packageId,
  selectedAddons,
  selectedPaymentPlan,
  shippingMethod,
}: OrderSummaryProps) {
  const { packages } = usePackages();
  const { products } = useProducts();
  const pkg = packages.find(p => p.id === packageId);
  
  if (!pkg) return null;

  const selectedPlan = pkg.pricing.find(p => p.id === selectedPaymentPlan);
  const selectedShipping = pkg.shipping.options.find(o => String(o.id) === shippingMethod);
  
  // Get core products
  const coreProducts = pkg.products
    .filter(p => p.type === 'core')
    .map(p => products.find(product => product.id === p.productId))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const calculateSubtotal = () => {
    // Calculate core products total
    const coreTotal = coreProducts.reduce((total, product) => total + product.price, 0);
    
    // Apply bundle discount if enabled
    let basePrice = coreTotal;
    if (pkg.bundleDiscount.enabled) {
      const discount = pkg.bundleDiscount.type === 'percentage'
        ? coreTotal * (pkg.bundleDiscount.value / 100)
        : pkg.bundleDiscount.value;
      basePrice -= discount;
    }

    // Add selected add-ons
    const addonsTotal = selectedAddons.reduce((total, addon) => {
      const product = products.find(p => p.id === addon.id);
      return total + (product?.price || 0) * addon.quantity;
    }, 0);

    return basePrice + addonsTotal;
  };

  const calculateTaxableAmount = () => {
    // Calculate taxable amount for core products
    const coreTaxable = coreProducts
      .filter(product => product.taxEligible)
      .reduce((total, product) => total + product.price, 0);

    // Calculate taxable amount for add-ons
    const addonsTaxable = selectedAddons.reduce((total, addon) => {
      const product = products.find(p => p.id === addon.id);
      if (product?.taxEligible) {
        return total + (product.price * addon.quantity);
      }
      return total;
    }, 0);

    // Apply bundle discount proportionally to taxable amount if enabled
    if (pkg.bundleDiscount.enabled) {
      const totalBeforeDiscount = coreProducts.reduce((total, product) => total + product.price, 0);
      const taxableRatio = coreTaxable / totalBeforeDiscount;
      const discount = pkg.bundleDiscount.type === 'percentage'
        ? coreTaxable * (pkg.bundleDiscount.value / 100)
        : pkg.bundleDiscount.value * taxableRatio;
      return Math.max(0, coreTaxable - discount) + addonsTaxable;
    }

    return coreTaxable + addonsTaxable;
  };

  const subtotal = calculateSubtotal();
  const taxableAmount = calculateTaxableAmount();
  const shipping = selectedShipping?.rate || 0;
  const tax = taxableAmount * 0.1; // Example tax rate
  const financeFee = selectedPlan?.financeFee || 0;
  const total = subtotal + shipping + tax + financeFee;

  const calculatePaymentBreakdown = () => {
    if (!selectedPlan || selectedPlan.payments === 1) return null;

    const { payments, interval } = selectedPlan;

    // Calculate base amount per payment (excluding tax and shipping)
    let baseAmountPerPayment = subtotal / payments;

    // Add finance fee to base amount
    if (selectedPlan.financeFee > 0) {
      baseAmountPerPayment = (subtotal + selectedPlan.financeFee) / payments;
    }

    // For add-ons that shouldn't be split
    const nonSplitAddonsTotal = selectedAddons.reduce((total, addon) => {
      const product = products.find(p => p.id === addon.id);
      const packageProduct = pkg.products.find(p => p.productId === addon.id);
      if (product && packageProduct?.addonConfig?.splitPayments === false) {
        return total + (product.price * addon.quantity);
      }
      return total;
    }, 0);

    // First payment includes tax, shipping, and non-split add-ons
    const firstPayment = (baseAmountPerPayment - (nonSplitAddonsTotal / payments)) + nonSplitAddonsTotal + shipping + tax;
    
    // Remaining payments exclude tax, shipping, and include only split-eligible add-ons
    const remainingPayments = baseAmountPerPayment - (nonSplitAddonsTotal / payments);

    // Format interval unit for display
    const intervalUnit = interval.value === 1
      ? interval.unit.slice(0, -1) // Remove 's' from plural form
      : interval.unit;

    return {
      firstPayment,
      remainingPayments,
      numberOfRemainingPayments: payments - 1,
      intervalText: `each ${intervalUnit}`,
    };
  };

  const paymentBreakdown = calculatePaymentBreakdown();

  return (
    <div className="p-6">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">Core Products:</p>
          {coreProducts.map(product => (
            <div key={product.id} className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {product.name}
                {product.taxEligible && (
                  <span className="ml-1 text-xs text-gray-400">(Taxable)</span>
                )}
              </p>
              <p className="text-sm font-medium text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {pkg.bundleDiscount.enabled && (
          <div className="flex items-center justify-between text-green-600">
            <p className="text-sm">Bundle Discount</p>
            <p className="text-sm font-medium">
              -{pkg.bundleDiscount.type === 'percentage'
                ? `${pkg.bundleDiscount.value}%`
                : `$${pkg.bundleDiscount.value.toFixed(2)}`}
            </p>
          </div>
        )}

        {selectedAddons.length > 0 && (
          <div className="space-y-2 border-t border-gray-200 pt-4">
            <p className="text-sm font-medium text-gray-900">Add-ons:</p>
            {selectedAddons.map(addon => {
              const product = products.find(p => p.id === addon.id);
              if (!product) return null;
              return (
                <div key={addon.id} className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {product.name} {addon.quantity > 1 && `(x${addon.quantity})`}
                    {product.taxEligible && (
                      <span className="ml-1 text-xs text-gray-400">(Taxable)</span>
                    )}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    ${(product.price * addon.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
          </div>
          {financeFee > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Split Payment Fee</p>
              <p className="text-sm font-medium text-gray-900">${financeFee.toFixed(2)}</p>
            </div>
          )}
          {selectedShipping && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Shipping</p>
              <p className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Tax</p>
            <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-gray-900">
              {paymentBreakdown ? 'Total Due Today' : 'Total'}
            </p>
            <p className="text-base font-medium text-gray-900">
              ${paymentBreakdown ? paymentBreakdown.firstPayment.toFixed(2) : total.toFixed(2)}
            </p>
          </div>
          {paymentBreakdown && paymentBreakdown.numberOfRemainingPayments > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-500">
                First payment includes tax & shipping
              </p>
              <p className="text-sm text-gray-500">
                + {paymentBreakdown.numberOfRemainingPayments} payments of ${paymentBreakdown.remainingPayments.toFixed(2)} {paymentBreakdown.intervalText}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}