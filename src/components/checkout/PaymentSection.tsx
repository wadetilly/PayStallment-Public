import { usePackages } from '../../lib/hooks/usePackages';

interface PaymentSectionProps {
  packageId: number;
  selectedPaymentPlan: number | null;
  onPaymentPlanChange: (planId: number) => void;
  onSubmit: () => void;
}

export default function PaymentSection({
  packageId,
  selectedPaymentPlan,
  onPaymentPlanChange,
  onSubmit,
}: PaymentSectionProps) {
  const { packages } = usePackages();
  const pkg = packages.find(p => p.id === packageId);

  if (!pkg) return null;

  return (
    <div className="space-y-6">
      {/* Payment Plan Selection Box */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Payment Plan</h2>
        <div className="mt-4 space-y-2">
          {pkg.pricing.map(plan => (
            <label
              key={plan.id}
              className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
            >
              <input
                type="radio"
                name="paymentPlan"
                value={plan.id}
                checked={selectedPaymentPlan === plan.id}
                onChange={() => onPaymentPlanChange(plan.id)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                  <p className="text-sm text-gray-500">
                    {plan.payments} payments of ${(plan.amount / plan.payments).toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ${plan.amount.toFixed(2)}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Card Details and Submit Box */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Card Details</h2>
        <div className="mt-4">
          <div className="rounded-md border border-gray-200 p-4">
            {/* Stripe Elements will be mounted here */}
            <div id="card-element" className="min-h-[40px]" />
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Complete Purchase
        </button>
      </div>
    </div>
  );
}