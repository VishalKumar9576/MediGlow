import { useState } from 'react';
import api from '../api/apiService';
import { ArrowLeft, Upload, Save, X, Type, Image as ImageIcon, Palette, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';

const AddCategory = ({ onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    color: '#3b82f6',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/categories', formData);
      toast.success('Category added successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error adding category:', err);
      toast.error('Failed to add category. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Type size={16} className="text-gray-400" /> Category Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Skin Care, Hair Care..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <ImageIcon size={16} className="text-gray-400" /> Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.png"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <Palette size={16} className="text-gray-400" /> Theme Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="h-10 w-20 p-1 border border-gray-200 rounded-xl bg-white cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={formData.color}
                      onChange={handleChange}
                      name="color"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-md uppercase font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <ClipboardList size={16} className="text-gray-400" /> Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a brief description of the category..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-50">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 border border-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {loading ? 'Saving...' : <><Save size={18} /> Save Category</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <p className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Preview Card</p>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 group transition-all hover:scale-[1.02]">
              <div 
                className="h-48 w-full relative flex items-center justify-center p-8 transition-colors duration-500"
                style={{ background: `linear-gradient(135deg, ${formData.color}11, ${formData.color}22)` }}
              >
                {formData.image ? (
                  <img 
                    src={formData.image.startsWith('http') ? formData.image : (formData.image.startsWith('/') ? formData.image.replace(/\\/g, '/') : `/${formData.image.replace(/\\/g, '/')}`)} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain drop-shadow-lg"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400?text=Invalid+Image'; }}
                  />
                ) : (
                  <ImageIcon size={64} className="text-gray-200" />
                )}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: formData.color }}
                ></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {formData.title || 'Category Title'}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                  {formData.description || 'Category description will appear here after you type it...'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">0 PRODUCTS</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: formData.color }}></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Preview</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
