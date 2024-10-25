import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Package } from '../../types/package';
import PackageDialog from '../../components/packages/PackageDialog';
import { usePackages } from '../../lib/hooks/usePackages';
import PackageList from '../../components/packages/PackageList';

export default function Packages() {
  const { packages, isLoading, createPackage, updatePackage } = usePackages();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>();

  const handleSubmit = async (data: Omit<Package, 'id'> | Package) => {
    if ('id' in data) {
      await updatePackage.mutateAsync(data);
    } else {
      await createPackage.mutateAsync(data);
    }
    setIsDialogOpen(false);
    setSelectedPackage(undefined);
  };

  const handleEdit = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Packages</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage your product packages
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPackage(undefined);
            setIsDialogOpen(true);
          }}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4" />
          Create Package
        </button>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <PackageList
          packages={packages}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>

      <PackageDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedPackage(undefined);
        }}
        onSubmit={handleSubmit}
        package={selectedPackage}
      />
    </div>
  );
}