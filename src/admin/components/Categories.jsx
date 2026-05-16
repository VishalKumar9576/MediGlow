import { useEffect, useState } from 'react';
import api from '../api/apiService';
import AddCategory from './AddCategory';
import toast from 'react-hot-toast';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  LayoutGrid,
  List
} from 'lucide-react';

const CategoriesPage = ({ onAddCategory }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({ title: '', image: '', color: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setEditData({
        title: selectedCategory.title || '',
        image: selectedCategory.image || '',
        color: selectedCategory.color || '#3b82f6',
        description: selectedCategory.description || ''
      });
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      const data = response.data.data || [];
      setCategories(data);
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0]);
      } else if (selectedCategory) {
        // Refresh selected category from new data
        const updated = data.find(c => c.id === selectedCategory.id);
        if (updated) setSelectedCategory(updated);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    try {
      setLoading(true);
      await api.put(`/categories/${selectedCategory.id}`, editData);
      toast.success('Category updated successfully!');
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error('Failed to update category.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filtered = (categories || []).filter(c =>
    (c.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-end items-center mb-6">
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition cursor-pointer text-sm font-bold shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} /> Add New Category
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
          <AddCategory 
            onCancel={() => setShowAddForm(false)} 
            onSuccess={() => {
              setShowAddForm(false);
              fetchCategories();
            }} 
          />
        </div>
      )}

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Search & View Toggle */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition"
              />
            </div>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition cursor-pointer ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition cursor-pointer ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
            {filtered.map(cat => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition cursor-pointer ${
                  selectedCategory?.id === cat.id ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-gray-100'
                }`}
              >
                {/* Category Image */}
                <div className="h-36 w-full overflow-hidden relative" style={{ background: cat.color ? `linear-gradient(135deg, ${cat.color}11, ${cat.color}22)` : '#f9fafb' }}>
                  <img
                    src={cat.image ? (cat.image.startsWith('http') ? cat.image : `/${cat.image.replace(/\\/g, '/')}`) : 'https://placehold.co/400x200?text=No+Image'}
                    alt={cat.title}
                    className="w-full h-full object-contain p-4 drop-shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/400x200?text=Error';0
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: cat.color || '#3b82f6' }}></div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-gray-800 truncate">{cat.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</span>
                      <div className={`w-8 h-4 rounded-full relative cursor-pointer transition ${cat.active !== false ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${cat.active !== false ? 'left-4.5' : 'left-0.5'}`}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 mb-3">{cat.products || 0} PRODUCTS</p>
                  <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px]">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Category Details */}
        {selectedCategory && (
          <div className="w-80 flex-shrink-0 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                <Edit size={18} className="text-blue-600" /> Edit Category
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Category title</label>
                  <input 
                    type="text" 
                    value={editData.title} 
                    onChange={e => setEditData({...editData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition" 
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Description</label>
                  <textarea 
                    value={editData.description} 
                    onChange={e => setEditData({...editData, description: e.target.value})}
                    rows={4} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition" 
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Image URL</label>
                  <input 
                    type="text" 
                    value={editData.image} 
                    onChange={e => setEditData({...editData, image: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition" 
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Theme Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={editData.color} 
                      onChange={e => setEditData({...editData, color: e.target.value})}
                      className="h-10 w-12 p-1 border border-gray-200 rounded-xl bg-white cursor-pointer" 
                    />
                    <input 
                      type="text" 
                      value={editData.color} 
                      onChange={e => setEditData({...editData, color: e.target.value})}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-mono uppercase" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    onClick={handleUpdateCategory}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition cursor-pointer">
                    Cancel
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                    <span>Created Date</span>
                    <span className="text-gray-600">{selectedCategory.created_at ? new Date(selectedCategory.created_at).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;