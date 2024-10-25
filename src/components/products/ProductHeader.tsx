import React from 'react';

function ProductHeader() {
  return (
    <div className="sm:flex-auto">
      <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
      <p className="mt-2 text-sm text-gray-700">
        Manage your product catalog and configure tax settings
      </p>
    </div>
  );
}

export default ProductHeader;