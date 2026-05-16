import { useState } from 'react';
import api from '../api/apiService';
import { Package, ArrowLeft, Save, X, Upload } from 'lucide-react';

const AddBrand = ({ onCancel, onSuccess }) => {
  const [brand, setBrand] = useState({
    name: '',
    image: '',
    active: true,
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/brands', brand);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Package size={20} className="text-blue-600" /> Add New Brand
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Name *</label>
            <input
              type="text"
              required
              value={brand.name}
              onChange={(e) => setBrand({ ...brand, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              placeholder="e.g. Minimalist"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand Logo URL *</label>
            <div className="flex gap-3">
              <input
                type="text"
                required
                value={brand.image}
                onChange={(e) => setBrand({ ...brand, image: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                placeholder="https://example.com/logo.png"
              />
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {brand.image ? (
                  <img src={brand.image.startsWith('http') ? brand.image : `/${brand.image.replace(/\\/g, '/')}`} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <Upload size={16} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={brand.active}
                onChange={(e) => setBrand({ ...brand, active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 font-medium group-hover:text-blue-600 transition">Active Status</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={brand.featured}
                onChange={(e) => setBrand({ ...brand, featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 font-medium group-hover:text-amber-600 transition">Featured Brand</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : <><Save size={16} /> Save Brand</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;
