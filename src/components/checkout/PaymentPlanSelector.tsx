import { usePackages } from '../../lib/hooks/usePackages';

interface PaymentPlanSelectorProps {
  packageId: number;
  selectedPaymentPlan: number | null;
  onPaymentPlanChange: (planId: number) => void;
}

export default function PaymentPlanSelector({
  packageId,
  selectedPaymentPlan,
  onPaymentPlanChange,
}: PaymentPlanSelectorProps) {
  const { packages } = usePackages();
  const pkg = packages.find(p => p.id === packageId);

  if (!pkg) return null;

  return (
    <div>
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
            <span className="text-sm font-medium text-gray-900">{plan.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}