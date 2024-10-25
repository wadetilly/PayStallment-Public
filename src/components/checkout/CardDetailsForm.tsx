interface CardDetailsFormProps {
  onSubmit: () => void;
}

export default function CardDetailsForm({ onSubmit }: CardDetailsFormProps) {
  return (
    <div>
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
  );
}