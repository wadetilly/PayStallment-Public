import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from '../pages/admin/Dashboard';
import Products from '../pages/admin/Products';
import Brands from '../pages/admin/Brands';
import Packages from '../pages/admin/Packages';
import Payments from '../pages/admin/Payments';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="brands" element={<Brands />} />
            <Route path="packages" element={<Packages />} />
            <Route path="payments" element={<Payments />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}