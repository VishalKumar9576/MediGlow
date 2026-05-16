import { useEffect, useState } from 'react';
import api from '../api/apiService';
import AddBrand from './AddBrand';
import {
  ShoppingBag,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  TrendingUp,
  X,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const BrandsPage = ({ onAddBrand }) => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await api.get('/brands');
      setBrands(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setEditModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedBrand(null);
    document.body.style.overflow = 'auto';
  };

  // Open delete modal
  const openDeleteModal = (brand) => {
    setSelectedBrand(brand);
    setDeleteModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedBrand(null);
    document.body.style.overflow = 'auto';
  };

  // Handle brand update
  const handleUpdateBrand = async (brandId, formData) => {
    try {
      setUpdateLoading(true);
      const response = await api.put(`/brands/${brandId}`, formData);
      
        if (response.data.success) {
        // Update the brand in the local state
        setBrands(prevBrands => 
          prevBrands.map(brand => 
            brand.id === brandId ? { ...brand, ...formData } : brand
          )
        );
        toast.success('Brand updated successfully!');
        closeEditModal();
      } else {
        toast.error('Failed to update brand');
      }
    } catch (err) {
      console.error('Error updating brand:', err);
      toast.error('Error updating brand. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle brand delete
  const handleDeleteBrand = async (brandId) => {
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/brands/${brandId}`);
      
      if (response.data.success) {
        // Remove the brand from the local state
        setBrands(prevBrands => prevBrands.filter(brand => brand.id !== brandId));
        toast.success('Brand deleted successfully!');
        closeDeleteModal();
      } else {
        toast.error('Failed to delete brand');
      }
    } catch (err) {
      console.error('Error deleting brand:', err);
      toast.error('Error deleting brand. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredBrands = brands
    .filter(brand => {
      const name = brand.name || '';
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all'
        ? true
        : statusFilter === 'active'
          ? brand.active
          : !brand.active;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      if (sortBy === 'name-asc') return nameA.localeCompare(nameB);
      if (sortBy === 'name-desc') return nameB.localeCompare(nameA);
      if (sortBy === 'products') return (b.products || 0) - (a.products || 0);
      return 0;
    });

  const totalBrands = brands.length;
  const activeBrands = (brands || []).filter(b => b.active).length;
  const featuredBrands = (brands || []).filter(b => b.featured).length;

  // Edit Brand Modal Component
  const EditBrandModal = ({ brand, onClose }) => {
    if (!brand) return null;

    const [formData, setFormData] = useState({
      name: brand.name || '',
      active: brand.active || false,
      featured: brand.featured || false,
      products: brand.products || 0,
      image: brand.image || ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      await handleUpdateBrand(brand.id, formData);
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="flex min-h-full items-center justify-end p-4">
          <div className="relative bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Brand</h2>
                <p className="text-sm text-gray-500 mt-1">Update brand information</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, active: !formData.active})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.active ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Featured Brand</label>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, featured: !formData.featured})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.featured ? 'bg-amber-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.featured ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updateLoading && <Loader size={16} className="animate-spin" />}
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Delete Brand Modal Component
  const DeleteBrandModal = ({ brand, onClose }) => {
    if (!brand) return null;

    const handleDelete = async () => {
      await handleDeleteBrand(brand.id);
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="flex min-h-full items-center justify-end p-4">
          <div className="relative bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete Brand</h2>
                <p className="text-sm text-gray-500 mt-1">Remove brand from catalog</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Are you sure?
              </h3>
              <p className="text-gray-500 text-center mb-6">
                You are about to delete <span className="font-semibold text-gray-700">{brand.name}</span>. 
                This action cannot be undone and will remove all associated data.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  ⚠️ Warning: This brand has {brand.products} product(s) associated with it. 
                  Deleting this brand may affect these products.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading && <Loader size={16} className="animate-spin" />}
                {deleteLoading ? 'Deleting...' : 'Delete Brand'}
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Brands</h1>
          <p className="text-gray-500 text-sm">Manage your brand catalog</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition cursor-pointer"
        >
          <Plus size={18} /> Add New Brand
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
          <AddBrand 
            onCancel={() => setShowAddForm(false)} 
            onSuccess={() => {
              setShowAddForm(false);
              fetchBrands();
            }} 
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Brands</p>
              <p className="text-3xl font-bold text-gray-800">{totalBrands}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full"><ShoppingBag size={24} className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Brands</p>
              <p className="text-3xl font-bold text-green-600">{activeBrands}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full"><CheckCircle size={24} className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Featured</p>
              <p className="text-3xl font-bold text-amber-600">{featuredBrands}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full"><TrendingUp size={24} className="text-amber-600" /></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="products">Most Products</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">Showing {filteredBrands.length} of {totalBrands} brands</div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredBrands.map(brand => (
          <div key={brand.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                <img src={brand.image ? (brand.image.startsWith('http') ? brand.image : `/${brand.image.replace(/\\/g, '/')}`) : ''} alt={brand.name} className="w-12 h-12 object-contain" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Brand')} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{brand.name}</h3>
                <p className="text-sm text-gray-500">{brand.products} Products</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${brand.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {brand.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 p-3 flex justify-end gap-3">
              <button 
                onClick={() => openEditModal(brand)}
                className="text-gray-500 hover:text-blue-600 transition cursor-pointer"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => openDeleteModal(brand)}
                className="text-gray-500 hover:text-red-600 transition cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <EditBrandModal brand={selectedBrand} onClose={closeEditModal} />
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <DeleteBrandModal brand={selectedBrand} onClose={closeDeleteModal} />
      )}
    </div>
  );
};

export default BrandsPage;