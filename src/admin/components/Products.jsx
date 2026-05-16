import { useEffect, useState } from 'react';
import api from '../api/apiService';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', description: '', price: '', old_price: '', rating: '0', size: '', quantity: '', status: 'Active', image_url: '', category_id: '', brand_id: ''
  });
  const itemsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [prodRes, catRes, brandRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/brands')
      ]);
      
      const products = prodRes.data?.data || prodRes.data || [];
      const categoriesData = catRes.data?.data || catRes.data || [];
      const brandsData = brandRes.data?.data || brandRes.data || [];
      
      const categoriesMap = {};
      categoriesData.forEach(cat => {
        categoriesMap[cat.id] = cat.title || cat.name;
      });
      
      const brandsMap = {};
      brandsData.forEach(brand => {
        brandsMap[brand.id] = brand.name;
      });
      
      const productsWithNames = products.map(product => ({
        ...product,
        old_price: product.old_price ?? product.oldPrice ?? null,
        oldPrice: product.oldPrice ?? product.old_price ?? null,
        rating: product.rating ?? 0,
        category_name: categoriesMap[product.category_id] || product.category_name || 'N/A',
        brand_name: brandsMap[product.brand_id] || product.brand_name || 'N/A',
        image: product.image || product.image_url || 'https://placehold.co/80x80?text=Product'
      }));
      
      setProductsList(productsWithNames);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to fetch data. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = productsList.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category_name === categoryFilter;
    const matchBrand = brandFilter === 'all' || p.brand_name === brandFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchCat && matchBrand && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
    if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  
  const toggleAll = () => {
    if (selectedIds.length === paginatedProducts.length) setSelectedIds([]);
    else setSelectedIds(paginatedProducts.map(p => p.id));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-600 border border-green-200';
      case 'Draft': return 'bg-gray-100 text-gray-600 border border-gray-200';
      case 'Out of Stock': return 'bg-red-50 text-red-600 border border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.sku || !newProduct.price || !newProduct.category_id || !newProduct.brand_id) {
      toast.error('Please fill all required fields (Name, SKU, Price, Category, Brand)');
      return;
    }

    const parsedPrice = parseFloat(newProduct.price);
    const parsedOldPrice = newProduct.old_price === '' ? null : parseFloat(newProduct.old_price);
    const parsedRating = newProduct.rating === '' ? 0 : parseFloat(newProduct.rating);

    if (parsedOldPrice !== null && (Number.isNaN(parsedOldPrice) || parsedOldPrice < parsedPrice)) {
      toast.error('Old price should be greater than or equal to current price');
      return;
    }

    if (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      toast.error('Rating must be between 0 and 5');
      return;
    }
    
    try {
      setAddLoading(true);
      
      const productData = {
        name: newProduct.name,
        sku: newProduct.sku,
        description: newProduct.description?.trim() || '',
        price: parsedPrice,
        old_price: parsedOldPrice,
        rating: parsedRating,
        size: newProduct.size?.trim() || null,
        quantity: parseInt(newProduct.quantity) || 0,
        status: newProduct.status,
        image_url: newProduct.image_url || '',
        category_id: parseInt(newProduct.category_id),
        brand_id: parseInt(newProduct.brand_id)
      };
      
      const response = await api.post('/products', productData);
      
      if (response.data.success || response.status === 200 || response.status === 201) {
        await fetchData();
        setNewProduct({ 
          name: '', sku: '', description: '', price: '', old_price: '', rating: '0', size: '', quantity: '', 
          status: 'Active', image_url: '', category_id: '', brand_id: '' 
        });
        setAddModalOpen(false);
        toast.success('Product added successfully!');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error(err.response?.data?.message || 'Error adding product. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateProduct = async (productId, formData) => {
    const parsedPrice = parseFloat(formData.price);
    const parsedOldPrice = formData.old_price === '' ? null : parseFloat(formData.old_price);
    const parsedRating = formData.rating === '' ? 0 : parseFloat(formData.rating);

    if (parsedOldPrice !== null && (Number.isNaN(parsedOldPrice) || parsedOldPrice < parsedPrice)) {
      toast.error('Old price should be greater than or equal to current price');
      return;
    }

    if (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      toast.error('Rating must be between 0 and 5');
      return;
    }

    try {
      setUpdateLoading(true);
      
      const updateData = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description?.trim() || '',
        price: parsedPrice,
        old_price: parsedOldPrice,
        rating: parsedRating,
        size: formData.size?.trim() || null,
        quantity: parseInt(formData.quantity) || 0,
        status: formData.status,
        image_url: formData.image_url,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        brand_id: formData.brand_id ? parseInt(formData.brand_id) : null
      };
      
      const response = await api.put(`/products/${productId}`, updateData);
      
      if (response.data.success || response.status === 200) {
        await fetchData();
        toast.success('Product updated successfully!');
        closeEditModal();
      }
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error(err.response?.data?.message || 'Error updating product. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setDeleteLoading(true);
      const response = await api.delete(`/products/${id}`);
      
      if (response.data.success || response.status === 200) {
        setProductsList(prev => prev.filter(p => p.id !== id));
        setSelectedIds(prev => prev.filter(x => x !== id));
        toast.success('Product deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(err.response?.data?.message || 'Error deleting product. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected products?`)) return;
    
    try {
      setDeleteLoading(true);
      
      for (const id of selectedIds) {
        await api.delete(`/products/${id}`);
      }
      
      await fetchData();
      setSelectedIds([]);
      setCurrentPage(1);
      toast.success('Selected products deleted successfully!');
    } catch (err) {
      console.error('Error deleting products:', err);
      toast.error('Error deleting some products. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const EditProductModal = ({ product, onClose, onUpdate, categories, brands, loading }) => {
    if (!product) return null;

    const [formData, setFormData] = useState({
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      price: product.price || '',
      old_price: product.old_price ?? product.oldPrice ?? '',
      rating: product.rating ?? '0',
      size: product.size || '',
      quantity: product.quantity || '',
      status: product.status || 'Active',
      image_url: product.image_url || product.image || '',
      category_id: product.category_id || '',
      brand_id: product.brand_id || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      await onUpdate(product.id, formData);
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm">
        <div className="bg-white w-full max-w-sm md:max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
              <p className="text-sm text-gray-500 mt-1">Update product information</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white/50 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="overflow-y-auto p-6 flex-1">
            <form id="editProductForm" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                <input 
                  name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU *</label>
                <input name="sku" value={formData.sku} onChange={handleChange} required
                  placeholder="e.g. CLK-016"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                <p className="mt-1 text-xs text-gray-400">Unique product code for inventory tracking.</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Write short product details..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Old Price (₹)</label>
                <input type="number" step="0.01" name="old_price" value={formData.old_price} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (0-5)</label>
                <input type="number" min="0" max="5" step="0.1" name="rating" value={formData.rating} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Size</label>
                <input name="size" value={formData.size} onChange={handleChange}
                  placeholder="e.g. 50ml"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.title || c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand *</label>
                <select name="brand_id" value={formData.brand_id} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                <input name="image_url" value={formData.image_url} onChange={handleChange}
                  placeholder="https://example.com/image.png"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                {formData.image_url && (
                  <div className="mt-3">
                    <img src={formData.image_url} alt="Preview" className="h-20 w-20 object-cover rounded-lg border"
                      onError={(e) => e.currentTarget.src = 'https://placehold.co/80x80?text=Preview'} />
                  </div>
                )}
              </div>
            </form>
          </div>
          
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border">
              Cancel
            </button>
            <button type="submit" form="editProductForm" disabled={loading}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              {loading && <Loader size={16} className="animate-spin" />}
              {loading ? 'Updating...' : 'Update Product'}
            </button>
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
      <div className="flex justify-end items-center mb-6">
        <button 
          onClick={() => setAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition text-sm font-medium shadow-sm"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">Bulk actions</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{selectedIds.length} selected</span>
            <button onClick={handleBulkDelete} disabled={deleteLoading}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 flex items-center gap-2">
              {deleteLoading && <Loader size={14} className="animate-spin" />}
              {deleteLoading ? 'Deleting...' : 'Delete Selected'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border px-4 py-2 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search products..." value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Category</label>
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} 
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="all">All Categories</option>
              {[...new Set(productsList.map(p => p.category_name))].filter(Boolean).map(c => 
                <option key={c} value={c}>{c}</option>
              )}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Brand</label>
            <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="all">All Brands</option>
              {[...new Set(productsList.map(p => p.brand_name))].filter(Boolean).map(b => 
                <option key={b} value={b}>{b}</option>
              )}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Status</label>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-medium mb-1 block">Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="newest">Newest First</option>
              <option value="name">Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0} 
                    onChange={toggleAll} className="w-4 h-4 rounded accent-blue-600" />
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Brand</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Size</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <tr key={product.id} className={`border-t hover:bg-gray-50/50 ${selectedIds.includes(product.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <input type="checkbox" checked={selectedIds.includes(product.id)} 
                        onChange={() => toggleSelect(product.id)} className="w-4 h-4 rounded accent-blue-600" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => e.currentTarget.src = 'https://placehold.co/80x80?text=Product'} />
                        <span className="text-sm font-medium text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 font-mono">{product.sku || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{product.category_name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{product.brand_name}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">₹{(Number(product.price) || 0).toLocaleString()}</span>
                        {Number(product.old_price || product.oldPrice) > 0 && (
                          <span className="text-xs text-gray-400 line-through">₹{Number(product.old_price || product.oldPrice).toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1">
                        <Star size={14} className="text-amber-500" fill="currentColor" />
                        <span className="text-sm font-medium text-gray-700">{(Number(product.rating) || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{product.size || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{product.quantity || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(product.status)}`}>
                        {product.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(product)} className="text-gray-400 hover:text-blue-600 transition p-1">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} disabled={deleteLoading}
                          className="text-gray-400 hover:text-red-600 transition p-1 disabled:opacity-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-8 text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1.5 rounded-lg border text-gray-500 hover:bg-gray-50 disabled:opacity-30">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50 border'}`}>
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border text-gray-500 hover:bg-gray-50 disabled:opacity-30">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm md:max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
                <p className="text-sm text-gray-500 mt-1">Create a new product</p>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white/50 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form id="addProductForm" onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                  <input name="name" value={newProduct.name} onChange={handleInputChange} required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU *</label>
                  <input name="sku" value={newProduct.sku} onChange={handleInputChange} required
                    placeholder="e.g. CLK-016"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                  <p className="mt-1 text-xs text-gray-400">Unique product code for inventory tracking.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Write short product details..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                  <input type="number" step="0.01" name="price" value={newProduct.price} onChange={handleInputChange} required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Old Price (₹)</label>
                  <input type="number" step="0.01" name="old_price" value={newProduct.old_price} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating (0-5)</label>
                  <input type="number" min="0" max="5" step="0.1" name="rating" value={newProduct.rating} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Size</label>
                  <input name="size" value={newProduct.size} onChange={handleInputChange}
                    placeholder="e.g. 50ml"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                  <select name="category_id" value={newProduct.category_id} onChange={handleInputChange} required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.title || c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand *</label>
                  <select name="brand_id" value={newProduct.brand_id} onChange={handleInputChange} required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
                  <input type="number" name="quantity" value={newProduct.quantity} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select name="status" value={newProduct.status} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
                  <input name="image_url" value={newProduct.image_url} onChange={handleInputChange}
                    placeholder="https://example.com/image.png"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
                  {newProduct.image_url && (
                    <div className="mt-3">
                      <img src={newProduct.image_url} alt="Preview" className="h-20 w-20 object-cover rounded-lg border"
                        onError={(e) => e.currentTarget.src = 'https://placehold.co/80x80?text=Preview'} />
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button onClick={() => setAddModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 border">
                Cancel
              </button>
              <button type="submit" form="addProductForm" disabled={addLoading}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {addLoading && <Loader size={16} className="animate-spin" />}
                {addLoading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <EditProductModal 
          product={selectedProduct}
          onClose={closeEditModal}
          onUpdate={handleUpdateProduct}
          categories={categories}
          brands={brands}
          loading={updateLoading}
        />
      )}
    </div>
  );
};

export default ProductsPage;