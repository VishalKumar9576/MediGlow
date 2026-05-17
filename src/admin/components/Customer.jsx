import { useEffect, useState } from 'react';
import api from '../api/apiService';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  RefreshCw,
  BarChart3
} from 'lucide-react';

const CustomerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', city: '', password: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const [customersRes, statsRes] = await Promise.all([
        api.get('/users'),
        api.get('/users/customers/stats')
      ]);
      setCustomerList(customersRes.data.data || []);
      setStats(statsRes.data.data || null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('Please fill name and email fields.');
      return;
    }
    try {
      setActionLoading(true);
      await api.post('/users', {
        fullName: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        city: newCustomer.city,
        password: newCustomer.password || undefined
      });
      toast.success('Customer added successfully!');
      setAddCustomerModal(false);
      setNewCustomer({ name: '', email: '', phone: '', city: '', password: '' });
      fetchCustomers();
    } catch (err) {
      console.error('Error adding customer:', err);
      toast.error(err.response?.data?.message || 'Failed to add customer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.put(`/users/${editCustomer.id}`, {
        name: editCustomer.name,
        email: editCustomer.email,
        phone: editCustomer.phone,
        city: editCustomer.city
      });
      toast.success('Customer updated successfully!');
      setEditCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error('Error updating customer:', err);
      toast.error(err.response?.data?.message || 'Failed to update customer.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      setActionLoading(true);
      await api.delete(`/users/${id}`);
      toast.success('Customer deleted successfully!');
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer:', err);
      toast.error(err.response?.data?.message || 'Failed to delete customer.');
    } finally {
      setActionLoading(false);
    }
  };

  const allCities = [...new Set((customerList || []).map(c => c.city))].filter(Boolean);

  const filtered = (customerList || []).filter(c => {
    const matchSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                      (c.phone || '').includes(searchTerm);
    const matchSegment = segmentFilter === 'all' || c.segment === segmentFilter;
    const matchCity = cityFilter === 'all' || c.city === cityFilter;
    return matchSearch && matchSegment && matchCity;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedCustomers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getSegmentStyle = (segment) => {
    switch (segment) {
      case 'VIP': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'Regular': return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'New': return 'bg-green-50 text-green-600 border border-green-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getInitialColor = (initial) => {
    const colors = {
      P: 'bg-pink-100 text-pink-600',
      R: 'bg-blue-100 text-blue-600',
      A: 'bg-purple-100 text-purple-600',
      V: 'bg-amber-100 text-amber-600',
      M: 'bg-rose-100 text-rose-600',
      S: 'bg-teal-100 text-teal-600',
      K: 'bg-cyan-100 text-cyan-600',
    };
    return colors[initial] || 'bg-gray-100 text-gray-600';
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and segment your shop's users</p>
        </div>
        <button 
          onClick={() => setAddCustomerModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition text-sm font-medium shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Add New Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-pink-50/60 rounded-xl p-5 flex items-center justify-between transition-transform hover:scale-105">
          <div>
            <p className="text-sm text-black font-medium">Total Customers</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-black">{stats?.totalCustomers?.toLocaleString() || '0'}</p>
              <span className="text-sm text-green-500 font-medium">↗ +0%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center"><Users size={24} className="text-pink-600" /></div>
        </div>
        <div className="bg-blue-50/60 rounded-xl p-5 flex items-center justify-between transition-transform hover:scale-105">
          <div>
            <p className="text-sm text-black font-medium">New This Month</p>
            <p className="text-3xl font-bold text-black">{stats?.newThisMonth?.toLocaleString() || '0'}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><UserPlus size={24} className="text-blue-600" /></div>
        </div>
        <div className="bg-green-50/60 rounded-xl p-5 flex items-center justify-between transition-transform hover:scale-105">
          <div>
            <p className="text-sm text-black font-medium">Returning</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-black">{stats?.returningCustomers?.toLocaleString() || '0'}</p>
              <span className="text-sm text-black">
                {stats?.totalCustomers > 0 
                  ? ((stats.returningCustomers / stats.totalCustomers) * 100).toFixed(1) 
                  : 0}%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><RefreshCw size={24} className="text-green-600" /></div>
        </div>
        <div className="bg-amber-50/60 rounded-xl p-5 flex items-center justify-between transition-transform hover:scale-105">
          <div>
            <p className="text-sm text-black font-medium">Avg. Order Value</p>
            <p className="text-3xl font-bold text-black">₹{stats?.avgOrderValue?.toLocaleString() || '0'}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center"><BarChart3 size={24} className="text-amber-600" /></div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-0 rounded-b-none">
        <div className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select value={segmentFilter} onChange={(e) => { setSegmentFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg font-semibold text-md bg-white cursor-pointer">
            <option value="all">All Customer</option>
            <option value="VIP">VIP</option>
            <option value="Regular">Regular</option>
            <option value="New">New</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg font-semibold text-md bg-white cursor-pointer">
            <option>Join Date</option>
          </select>
          <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg font-semibold text-md bg-white cursor-pointer">
            <option value="all">All City</option>
            {allCities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl rounded-t-none shadow-sm border border-t-0 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-3 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="text-left py-3 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left py-3 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">City</th>
                <th className="text-left py-3 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="text-left py-3 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="text-left py-3 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Segment</th>
                <th className="text-left py-3 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Last Order</th>
                <th className="text-left py-3 px-5 text-sm font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map(customer => (
                <tr key={customer.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${getInitialColor(customer.initial)}`}>
                        {customer.initial}
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-700">{customer.name}</p>
                        <p className="text-sm text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-base text-gray-500">{customer.phone}</td>
                  <td className="py-3.5 px-5 text-base text-gray-500">{customer.city}</td>
                  <td className="py-3.5 px-5 text-base text-gray-700">{customer.totalOrders}</td>
                  <td className="py-3.5 px-5 text-base font-medium text-gray-700">{customer.totalSpent > 0 ? `₹${customer.totalSpent.toLocaleString()}` : '0'}</td>
                  <td className="py-3.5 px-5">
                    <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${getSegmentStyle(customer.segment)}`}>{customer.segment}</span>
                  </td>
                  <td className="py-3.5 px-5 text-base text-gray-500">{customer.lastOrder}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center justify-center gap-4 ">
                      <button onClick={() => setViewCustomer(customer)} className="text-gray-600 hover:text-blue-600 transition cursor-pointer" title="View Details"><Eye size={15} /></button>
                      <button onClick={() => setEditCustomer(customer)} className="text-gray-600 hover:text-amber-600 transition cursor-pointer" title="Edit Customer"><Edit size={15} /></button>
                      <button onClick={() => handleDeleteCustomer(customer.id)} className="text-gray-600 hover:text-red-600 transition cursor-pointer" title="Delete Customer"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {stats?.totalCustomers || filtered.length} customers</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(pageNum => (
              <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer transition ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>{pageNum}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* View Customer Details Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Customer Details</h2>
              <button onClick={() => setViewCustomer(null)} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">&times;</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${getInitialColor(viewCustomer.initial)}`}>
                  {viewCustomer.initial}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{viewCustomer.name}</h3>
                  <p className="text-sm text-gray-500">{viewCustomer.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-500">Phone</span>
                  <span className="text-sm font-medium text-gray-800">{viewCustomer.phone}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-500">City</span>
                  <span className="text-sm font-medium text-gray-800">{viewCustomer.city}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-500">Segment</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSegmentStyle(viewCustomer.segment)}`}>{viewCustomer.segment}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-500">Total Orders</span>
                  <span className="text-sm font-medium text-gray-800">{viewCustomer.totalOrders}</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-sm font-medium text-gray-500">Total Spent</span>
                  <span className="text-sm font-medium text-gray-800">₹{viewCustomer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Last Order</span>
                  <span className="text-sm font-medium text-gray-800">{viewCustomer.lastOrder}</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setViewCustomer(null)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Edit Customer</h2>
              <button onClick={() => setEditCustomer(null)} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">&times;</button>
            </div>
            <div className="overflow-y-auto p-6 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <form id="editCustomerForm" onSubmit={handleEditSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input type="text" value={editCustomer.name} onChange={e => setEditCustomer({...editCustomer, name: e.target.value, initial: e.target.value.charAt(0).toUpperCase()})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={editCustomer.email} onChange={e => setEditCustomer({...editCustomer, email: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={editCustomer.phone} onChange={e => setEditCustomer({...editCustomer, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={editCustomer.city} onChange={e => setEditCustomer({...editCustomer, city: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segment</label>
                  <select value={editCustomer.segment} onChange={e => setEditCustomer({...editCustomer, segment: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition cursor-pointer">
                    <option value="VIP">VIP</option>
                    <option value="Regular">Regular</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-white">
              <button type="button" onClick={() => setEditCustomer(null)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="submit" form="editCustomerForm" disabled={actionLoading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer disabled:opacity-50">
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {addCustomerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Add New Customer</h2>
              <button onClick={() => setAddCustomerModal(false)} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">&times;</button>
            </div>
            <div className="overflow-y-auto p-6 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <form id="addCustomerForm" onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <input type="text" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" placeholder="e.g. John Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" placeholder="e.g. john@example.com" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" placeholder="e.g. 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={newCustomer.city} onChange={e => setNewCustomer({...newCustomer, city: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" placeholder="e.g. Delhi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password (Optional)</label>
                  <input type="password" value={newCustomer.password} onChange={e => setNewCustomer({...newCustomer, password: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" placeholder="Leave empty for default (User@1234)" />
                </div>
              </form>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-white">
              <button type="button" onClick={() => setAddCustomerModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="submit" form="addCustomerForm" disabled={actionLoading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition cursor-pointer disabled:opacity-50">
                {actionLoading ? 'Adding...' : 'Add Customer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;