import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types/product';
import { cn } from '../../lib/utils';

interface ProductListItemProps {
  product: Product;
  onEdit: (product: Product) => void;
}

function ProductListItem({ product, onEdit }: ProductListItemProps) {
  return (
    <tr key={product.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {product.image ? (
              <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt="" />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{product.name}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        ${product.price.toFixed(2)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            product.taxEligible
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          )}
        >
          {product.taxEligible ? 'Tax Eligible' : 'Tax Exempt'}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            product.status === 'active'
              ? 'bg-green-100 text-green-800'
              : product.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          )}
        >
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          onClick={() => onEdit(product)}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}

export default ProductListItem;