import { useEffect, useState } from 'react';
import api from '../api/apiService';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users
} from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalRevenue: '₹0',
    revenueGrowth: '0%',
    totalOrders: '0',
    totalProducts: '0',
    activeCustomers: '0',
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      const data = response.data.data;

      setStats({
        totalRevenue: data.totalRevenue,
        revenueGrowth: data.revenueGrowth,
        totalOrders: data.totalOrders,
        totalProducts: data.totalProducts,
        activeCustomers: data.activeCustomers,
      });

      setRecentOrders(data.recentOrders || []);
      setTopSellingProducts(data.topProducts || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  const filteredOrders = orderFilter === 'all'
    ? recentOrders
    : recentOrders.filter(o => (o.status || '').toLowerCase() === orderFilter);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed': 
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'processing': 
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'shipped': 
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'pending': 
        return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
      case 'cancelled': 
        return 'bg-red-50 text-red-600 border border-red-200';
      default: 
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>
          <p className="text-white/80 text-sm font-medium mb-2">Total Revenue</p>
          <p className="text-3xl font-bold mb-3">{stats.totalRevenue}</p>
          <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full">
            <TrendingUp size={12} /> {stats.revenueGrowth}
          </span>
        </div>

        {/* Total Orders */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <ShoppingCart size={60} />
          </div>
          <p className="text-white/80 text-sm font-medium mb-2">Total Orders</p>
          <p className="text-3xl font-bold mb-3">{stats.totalOrders}</p>
          <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full">
            <TrendingUp size={12} /> +12.5%
          </span>
        </div>

        {/* Products */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <Package size={60} />
          </div>
          <p className="text-white/80 text-sm font-medium mb-2">Total Products</p>
          <p className="text-3xl font-bold mb-3">{stats.totalProducts}</p>
          <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full">
            Active Stock
          </span>
        </div>

        {/* Active Customers */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <Users size={60} />
          </div>
          <p className="text-white/80 text-sm font-medium mb-2">Active Customers</p>
          <p className="text-3xl font-bold mb-3">{stats.activeCustomers}</p>
          <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2.5 py-1 rounded-full">
            <Users size={10} /> Active Now
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
          <div className="p-6 flex items-center justify-between border-b border-gray-200 shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Orders</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 z-10">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{order.customer_name || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                          {order.status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-200 shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-4">
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((product, idx) => (
                  <div key={product.id || idx} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Product';
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h4>
                      <p className="text-lg font-bold text-gray-900 mt-1">₹{Number(product.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      {/* <p className="text-xs text-gray-500 mt-1">
                        Stock: <span className={`font-medium ${parseInt(product.stock) > 10 ? 'text-green-600' : parseInt(product.stock) > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                          {product.stock || 0} units
                        </span>
                      </p> */}
                    </div>
                    {/* <div className="text-right">
                      <span className="text-xs font-medium text-gray-500">Sold</span>
                      <p className="text-sm font-bold text-gray-900">{product.sold_count || 0}</p>
                    </div> */}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;