import { Package2 } from 'lucide-react';
import { Package } from '../../types/package';
import PackageListItem from './PackageListItem';

interface PackageListProps {
  packages: Package[];
  isLoading: boolean;
  onEdit: (pkg: Package) => void;
}

export default function PackageList({ packages, isLoading, onEdit }: PackageListProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <Package2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No packages</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new package.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Package
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Brand
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Products
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {packages.map((pkg) => (
                <PackageListItem key={pkg.id} package={pkg} onEdit={onEdit} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}