import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackages } from '../../lib/hooks/usePackages';
import AddOnSelector from '../../components/checkout/AddOnSelector';
import ContactForm from '../../components/checkout/ContactForm';
import AddressForm from '../../components/checkout/AddressForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import PaymentPlanSelector from '../../components/checkout/PaymentPlanSelector';
import CardDetailsForm from '../../components/checkout/CardDetailsForm';
import { validateForm, checkoutSchema, type CheckoutFormData } from '../../lib/validation';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const { packages } = usePackages();
  const pkg = packages.find(p => p.id === Number(packageId));

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [selectedAddons, setSelectedAddons] = useState<Array<{ id: number; quantity: number }>>([]);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companyPhone: '',
  });
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<number | null>(null);

  // Set default shipping method and payment plan when package data is loaded
  useEffect(() => {
    if (pkg) {
      if (pkg.shipping.options.length > 0) {
        setShippingMethod(String(pkg.shipping.options[0].id));
      }
      if (pkg.pricing.length > 0) {
        setSelectedPaymentPlan(pkg.pricing[0].id);
      }
    }
  }, [pkg]);

  const handleSubmit = async () => {
    const formData: CheckoutFormData = {
      contact: contactInfo,
      billingAddress,
      shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
      sameAsBilling,
      selectedAddons,
      paymentPlan: selectedPaymentPlan || 0,
      shippingMethod,
    };

    const validation = validateForm(checkoutSchema, formData);

    if (!validation.success) {
      setFormErrors(validation.errors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(validation.errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Clear any previous errors
    setFormErrors({});

    try {
      // Handle successful form submission
      console.log('Form submitted successfully', formData);
      // Redirect or show success message
    } catch (error) {
      console.error('Submission error:', error);
      // Handle submission error
    }
  };

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Package not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-3">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add-ons Section */}
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6">
              <AddOnSelector
                packageId={Number(packageId)}
                selectedAddons={selectedAddons}
                onAddonChange={setSelectedAddons}
              />
            </div>

            {/* Customer Information Section */}
            <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6 space-y-6">
              <div>
                <ContactForm
                  value={contactInfo}
                  onChange={setContactInfo}
                  errors={formErrors.contact as any}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <AddressForm
                  title="Billing Address"
                  value={billingAddress}
                  onChange={setBillingAddress}
                  errors={formErrors.billingAddress as any}
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <AddressForm
                  title="Shipping Details"
                  value={shippingAddress}
                  onChange={setShippingAddress}
                  isShipping
                  billingAddress={billingAddress}
                  sameAsBilling={sameAsBilling}
                  onSameAsBillingChange={setSameAsBilling}
                  shippingMethod={shippingMethod}
                  onShippingMethodChange={setShippingMethod}
                  shippingOptions={pkg?.shipping.options}
                  errors={formErrors.shippingAddress as any}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Summary and Payment */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Payment Plan Selection */}
              <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6">
                <PaymentPlanSelector
                  packageId={Number(packageId)}
                  selectedPaymentPlan={selectedPaymentPlan}
                  onPaymentPlanChange={setSelectedPaymentPlan}
                />
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5">
                <OrderSummary
                  packageId={Number(packageId)}
                  selectedAddons={selectedAddons}
                  selectedPaymentPlan={selectedPaymentPlan}
                  shippingMethod={shippingMethod}
                />
              </div>

              {/* Card Details and Submit */}
              <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-6">
                <CardDetailsForm onSubmit={handleSubmit} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}