import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Building2, 
  Package, 
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag },
  { name: 'Brands', href: '/admin/brands', icon: Building2 },
  { name: 'Packages', href: '/admin/packages', icon: Package },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Package className="h-6 w-6 text-blue-600" />
        <span className="font-semibold">Brand Manager</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5',
                isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
              )} />
              {item.name}
              {isActive && (
                <ChevronRight className="ml-auto h-4 w-4 text-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}