import { useEffect, useState } from 'react';
import api from '../api/apiService';
import {
  Search,
  Plus,
  Eye,
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Settings,
  CheckCircle,
  X,
  MapPin,
  CreditCard,
  Package,
  Truck,
  Calendar,
  User,
  Mail,
  Phone,
  Hash,
  DollarSign
} from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  const tabs = [
    { label: 'All', count: null },
    { label: 'Pending', count: orders.filter(o => (o.status || '').toLowerCase() === 'pending').length },
    { label: 'Processing', count: orders.filter(o => (o.status || '').toLowerCase() === 'processing').length },
    { label: 'Shipped', count: orders.filter(o => (o.status || '').toLowerCase() === 'shipped').length },
    { label: 'Delivered', count: orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length },
    { label: 'Cancelled', count: orders.filter(o => (o.status || '').toLowerCase() === 'cancelled').length },
    { label: 'Returned', count: orders.filter(o => (o.status || '').toLowerCase() === 'returned').length },
  ];

  const filtered = orders.filter(o => {
    const matchSearch = (o.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (o.id || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (o.status || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'All' || (o.status || '').toLowerCase() === activeTab.toLowerCase();
    const matchPayment = paymentFilter === 'all' || (o.payment_method || '').toLowerCase() === paymentFilter.toLowerCase();
    const matchDate = dateFilter === '' ? true : new Date(o.created_at) >= new Date(dateFilter);
    
    return matchSearch && matchTab && matchPayment && matchDate;
  });

  const totalOrders = (orders || []).length;
  const pendingOrders = (orders || []).filter(o => (o.status || '').toLowerCase() === 'pending').length;
  const processingOrders = (orders || []).filter(o => (o.status || '').toLowerCase() === 'processing').length;
  const deliveredOrders = (orders || []).filter(o => (o.status || '').toLowerCase() === 'delivered').length;

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedOrders = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600 border border-green-200';
      case 'processing': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'shipped': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'pending': return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'cancelled': return 'bg-red-50 text-red-600 border border-red-200';
      case 'returned': return 'bg-purple-50 text-purple-600 border border-purple-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPaymentStyle = (payment) => {
    switch ((payment || '').toLowerCase()) {
      case 'paid': return 'bg-green-50 text-green-600';
      case 'cod': return 'bg-amber-50 text-amber-600';
      case 'refunded': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    document.body.style.overflow = 'auto';
  };

  // Preview Modal Component
  const OrderPreviewModal = ({ order, onClose }) => {
    if (!order) return null;

    const statusColor = {
      delivered: 'bg-green-100 text-green-800',
      processing: 'bg-amber-100 text-amber-800',
      shipped: 'bg-blue-100 text-blue-800',
      pending: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-purple-100 text-purple-800'
    }[(order.status || '').toLowerCase()] || 'bg-gray-100 text-gray-800';

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-end p-4">
          <div className="relative bg-white w-full max-w-sm md:max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status & Date Row */}
              <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Order Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{order.customer_name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900">{order.customer_email || order.email || 'N/A'}</p>
                      </div>
                    </div>
                    {/* <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-900">{order.phone || order.mobile || 'N/A'}</p>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    {/* <div className="flex items-start gap-3">
                      <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium text-gray-900">{order.payment_method || 'N/A'}</p>
                      </div>
                    </div> */}
                    {/* <div className="flex items-start gap-3">
                      <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPaymentStyle(order.payment_method)}`}>
                          {order.payment_method || 'N/A'}
                        </span>
                      </div>
                    </div> */}
                    <div className="flex items-start gap-3">
                      <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="font-medium text-gray-900">{order.transaction_id || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  Order Summary
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Items Total</p>
                      <p className="text-2xl font-bold text-gray-900">{order.item_count || (Array.isArray(order.items) ? order.items.length : order.items) || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                      <p className="text-lg font-semibold text-gray-900">₹{(Number(order.subtotal) || Number(order.total_amount) || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Shipping</p>
                      <p className="text-lg font-semibold text-gray-900">₹{(Number(order.shipping_charge) || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-600">₹{(Number(order.total_amount) || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Shipping Address
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{order.shipping_address.full_name || order.customer_name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.shipping_address.address_line1}<br />
                          {order.shipping_address.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
                          {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}<br />
                          {order.shipping_address.country}
                        </p>
                        {order.shipping_address.phone && (
                          <p className="text-sm text-gray-600 mt-2">📞 {order.shipping_address.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Items List (if available) */}
              {order.items && order.items.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Order Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-3 font-semibold text-gray-600">Product</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-600">Quantity</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-600">Price</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 text-gray-900">{item.name || item.product_name}</td>
                            <td className="py-2 px-3 text-gray-600">{item.quantity}</td>
                            <td className="py-2 px-3 text-gray-600">₹{item.price?.toLocaleString()}</td>
                            <td className="py-2 px-3 font-medium text-gray-900">₹{(item.price * item.quantity)?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Add download functionality here if needed
                  console.log('Download order:', order.id);
                }}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-blue-50/60 rounded-xl border border-blue-100 p-5 flex items-center gap-4 transition-transform hover:scale-105">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><ClipboardList size={24} className="text-blue-600" /></div>
          <div><p className="text-sm text-black font-medium">All Orders</p><p className="text-2xl font-bold text-black">{totalOrders}</p></div>
        </div>
        <div className="bg-orange-50/60 rounded-xl border border-orange-100 p-5 flex items-center gap-4 transition-transform hover:scale-105">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center"><Clock size={24} className="text-orange-600" /></div>
          <div><p className="text-sm text-black font-medium">Pending</p><p className="text-2xl font-bold text-black">{pendingOrders}</p></div>
        </div>
        <div className="bg-purple-50/60 rounded-xl border border-purple-100 p-5 flex items-center gap-4 transition-transform hover:scale-105">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center"><Settings size={24} className="text-purple-600" /></div>
          <div><p className="text-sm text-black font-medium">Processing</p><p className="text-2xl font-bold text-black">{processingOrders}</p></div>
        </div>
        <div className="bg-green-50/60 rounded-xl border border-green-100 p-5 flex items-center gap-4 transition-transform hover:scale-105">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><CheckCircle size={24} className="text-green-600" /></div>
          <div><p className="text-sm text-black font-medium">Delivered</p><p className="text-2xl font-bold text-black">{deliveredOrders}</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-100 px-5 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.label}
              onClick={() => { setActiveTab(tab.label); setCurrentPage(1); }}
              className={`px-4 py-3 text-md font-semibold border-b-2 transition cursor-pointer ${activeTab === tab.label ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
              {tab.count !== null && <span className={`ml-1.5 text-md px-2 ${activeTab === tab.label ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-black'}`}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="p-4 flex flex-wrap gap-3 items-center border-b border-gray-50">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 text-md text-gray-500 bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500">
            <span>📅</span>
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-md text-gray-600 focus:outline-none cursor-pointer"
            />
          </div>
          <select value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-md bg-white cursor-pointer">
            <option value="all">Payment filter</option>
            <option value="paid">Paid</option>
            <option value="cod">COD</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left py-3 px-5 text-md font-bold text-gray-500 uppercase">Order ID</th>
                <th className="text-left py-3 px-5 text-md font-bold text-gray-500 uppercase">Date</th>
                <th className="text-left py-3 px-5 text-md font-bold text-gray-500 uppercase">Customer</th>
                <th className="text-left py-3 px-5 text-md font-bold text-gray-500 uppercase">Items</th>
                <th className="text-left py-3 px-5 text-md font-bold text-gray-500 uppercase">Total</th>
                <th className="text-left py-3 px-5 text-md font-bold text-gray-500 uppercase">Payment</th>
                <th className="text-left py-3 px-5 text-md font-bold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-5 text-md font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, idx) => (
                <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-5 text-md font-medium text-gray-700">{order.id}</td>
                  <td className="py-3.5 px-5 text-md text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-3.5 px-5">
                    <div>
                      <p className="text-md font-medium text-gray-700">{order.customer_name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{order.customer_email || order.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-md text-gray-500">{order.item_count || (Array.isArray(order.items) ? order.items.length : order.items) || 0} items</td>
                  <td className="py-3.5 px-5 text-md font-medium text-gray-700">₹{(Number(order.total_amount) || 0).toLocaleString()}</td>
                  <td className="py-3.5 px-5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPaymentStyle(order.payment_method)}`}>{order.payment_method || 'N/A'}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openModal(order)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                        title="View Order Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-md text-gray-500">Showing {filtered.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} orders</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-sm text-gray-900 cursor-pointer flex items-center gap-1"><ChevronLeft size={14} /> prev</button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(pageNum => (
              <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer transition ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>{pageNum}</button>
            ))}
            {totalPages > 3 && <span className="text-gray-400 px-1">... {totalPages}</span>}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-sm text-gray-900 cursor-pointer flex items-center gap-1">next <ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isModalOpen && <OrderPreviewModal order={selectedOrder} onClose={closeModal} />}
    </div>
  );
};

export default OrdersPage;