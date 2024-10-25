import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Brand } from '../../types/brand';

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Brand, 'id'> | Brand) => void;
  brand?: Brand;
}

export default function BrandDialog({ open, onClose, onSubmit, brand }: BrandDialogProps) {
  const [formData, setFormData] = useState<Partial<Brand>>({
    name: '',
    email: '',
    sendgridKey: '',
    stripeKeys: {
      test: {
        publishable: '',
        secret: '',
      },
      live: {
        publishable: '',
        secret: '',
      },
    },
    taxjarKeys: {
      test: '',
      live: '',
    },
    defaultTaxRate: 0,
    status: 'inactive',
  });

  useEffect(() => {
    if (open) {
      setFormData(brand || {
        name: '',
        email: '',
        sendgridKey: '',
        stripeKeys: {
          test: {
            publishable: '',
            secret: '',
          },
          live: {
            publishable: '',
            secret: '',
          },
        },
        taxjarKeys: {
          test: '',
          live: '',
        },
        defaultTaxRate: 0,
        status: 'inactive',
      });
    }
  }, [open, brand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brand) {
      onSubmit({ ...formData, id: brand.id } as Brand);
    } else {
      onSubmit(formData as Omit<Brand, 'id'>);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white p-6 sm:max-w-xl sm:rounded-l-xl sm:border-l">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{brand ? 'Edit Brand' : 'New Brand'}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-900">Brand Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Brand Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name || ''}
                onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                id="logo"
                value={formData.logo || ''}
                onChange={e => setFormData(d => ({ ...d, logo: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Support Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email || ''}
                onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-900">API Keys</h3>

            <div>
              <label htmlFor="sendgridKey" className="block text-sm font-medium text-gray-700">
                SendGrid API Key
              </label>
              <input
                type="password"
                id="sendgridKey"
                value={formData.sendgridKey || ''}
                onChange={e => setFormData(d => ({ ...d, sendgridKey: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Stripe Test Keys</h4>
                <div className="mt-2 grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="stripeTestPublishable" className="block text-sm font-medium text-gray-600">
                      Publishable Key
                    </label>
                    <input
                      type="text"
                      id="stripeTestPublishable"
                      value={formData.stripeKeys?.test.publishable || ''}
                      onChange={e => setFormData(d => ({
                        ...d,
                        stripeKeys: {
                          ...d.stripeKeys,
                          test: {
                            ...d.stripeKeys?.test,
                            publishable: e.target.value,
                          },
                        },
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="stripeTestSecret" className="block text-sm font-medium text-gray-600">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      id="stripeTestSecret"
                      value={formData.stripeKeys?.test.secret || ''}
                      onChange={e => setFormData(d => ({
                        ...d,
                        stripeKeys: {
                          ...d.stripeKeys,
                          test: {
                            ...d.stripeKeys?.test,
                            secret: e.target.value,
                          },
                        },
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Stripe Live Keys</h4>
                <div className="mt-2 grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="stripeLivePublishable" className="block text-sm font-medium text-gray-600">
                      Publishable Key
                    </label>
                    <input
                      type="text"
                      id="stripeLivePublishable"
                      value={formData.stripeKeys?.live.publishable || ''}
                      onChange={e => setFormData(d => ({
                        ...d,
                        stripeKeys: {
                          ...d.stripeKeys,
                          live: {
                            ...d.stripeKeys?.live,
                            publishable: e.target.value,
                          },
                        },
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="stripeLiveSecret" className="block text-sm font-medium text-gray-600">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      id="stripeLiveSecret"
                      value={formData.stripeKeys?.live.secret || ''}
                      onChange={e => setFormData(d => ({
                        ...d,
                        stripeKeys: {
                          ...d.stripeKeys,
                          live: {
                            ...d.stripeKeys?.live,
                            secret: e.target.value,
                          },
                        },
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">TaxJar Keys</h4>
                <div className="mt-2 grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="taxjarTest" className="block text-sm font-medium text-gray-600">
                      Test Key
                    </label>
                    <input
                      type="password"
                      id="taxjarTest"
                      value={formData.taxjarKeys?.test || ''}
                      onChange={e => setFormData(d => ({
                        ...d,
                        taxjarKeys: {
                          ...d.taxjarKeys,
                          test: e.target.value,
                        },
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="taxjarLive" className="block text-sm font-medium text-gray-600">
                      Live Key
                    </label>
                    <input
                      type="password"
                      id="taxjarLive"
                      value={formData.taxjarKeys?.live || ''}
                      onChange={e => setFormData(d => ({
                        ...d,
                        taxjarKeys: {
                          ...d.taxjarKeys,
                          live: e.target.value,
                        },
                      }))}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-900">Settings</h3>

            <div>
              <label htmlFor="defaultTaxRate" className="block text-sm font-medium text-gray-700">
                Default Tax Rate (%)
              </label>
              <input
                type="number"
                id="defaultTaxRate"
                min="0"
                max="100"
                step="0.01"
                value={formData.defaultTaxRate || 0}
                onChange={e => setFormData(d => ({ ...d, defaultTaxRate: parseFloat(e.target.value) }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={formData.status || 'inactive'}
                onChange={e => setFormData(d => ({ ...d, status: e.target.value as Brand['status'] }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {brand ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}