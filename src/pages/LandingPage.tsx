import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8"></h1>
          <div className="space-y-4">
            <Link
              to="/admin/packages"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium transition-colors"
            >
              Go To Demo Admin Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/checkout/1"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg border-2 border-blue-600 hover:bg-blue-50 font-medium transition-colors"
            >
              Go To Demo Checkout Page
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}