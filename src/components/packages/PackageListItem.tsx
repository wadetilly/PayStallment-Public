import { Package2 } from 'lucide-react';
import { Package } from '../../types/package';
import { cn } from '../../lib/utils';
import { useBrands } from '../../lib/hooks/useBrands';

interface PackageListItemProps {
  package: Package;
  onEdit: (pkg: Package) => void;
}

export default function PackageListItem({ package: pkg, onEdit }: PackageListItemProps) {
  const { brands } = useBrands();
  const brand = brands.find(b => b.id === pkg.brandId);

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Package2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{pkg.name}</div>
            <div className="text-sm text-gray-500">{pkg.description}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {brand?.name || 'Unknown Brand'}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {pkg.products.length} products
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            pkg.status === 'active'
              ? 'bg-green-100 text-green-800'
              : pkg.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          )}
        >
          {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
        </span>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          onClick={() => onEdit(pkg)}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}