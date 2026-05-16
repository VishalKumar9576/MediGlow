import { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  FileText, 
  Settings, 
  Users, 
  ClipboardList, 
  LayoutGrid, 
  LogOut
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: BarChart3 },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Categories', path: '/admin/categories', icon: LayoutGrid },
    { name: 'Brands', path: '/admin/brands', icon: ShoppingBag },
    { name: 'Blog Posts', path: '/admin/blog', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const currentPath = location.pathname;
  const activeItem = navItems.find(item => item.path === currentPath)?.name || 'Admin Panel';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex-shrink-0 flex flex-col h-full">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800">DermaWala</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
                currentPath === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
          <div className="border-t border-gray-200 my-4"></div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200 flex-shrink-0 z-10">
          <h2 className="font-semibold text-gray-700 capitalize">
            {activeItem}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
                <p className="text-sm font-medium text-gray-800">{user?.fullName || 'Admin User'}</p>
                <p className="text-xs text-gray-500 uppercase">{user?.role || 'Admin'}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
          </div>
        </header>
        <div className="p-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
