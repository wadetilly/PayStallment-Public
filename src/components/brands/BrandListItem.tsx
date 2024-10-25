import { Building2 } from 'lucide-react';
import { Brand } from '../../types/brand';
import { cn } from '../../lib/utils';

interface BrandListItemProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
}

export default function BrandListItem({ brand, onEdit }: BrandListItemProps) {
  // Default to 'inactive' if status is undefined
  const status = brand.status || 'inactive';
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {brand.logo ? (
              <img className="h-10 w-10 rounded-lg object-cover" src={brand.logo} alt="" />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{brand.name}</div>
            <div className="text-sm text-gray-500">{brand.email}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {brand.defaultTaxRate}%
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          )}
        >
          {statusLabel}
        </span>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          onClick={() => onEdit(brand)}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}