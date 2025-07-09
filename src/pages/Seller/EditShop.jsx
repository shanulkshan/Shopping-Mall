import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditShop = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    category: '',
    stallNumber: '',
    floorNumber: '',
    description: '',
    shopLogo: null
  });
  const [logoPreview, setLogoPreview] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { value: "Cloth", label: "Clothing & Fashion" },
    { value: "Beauty", label: "Beauty & Cosmetics" },
    { value: "Book", label: "Books & Stationery" },
    { value: "Food", label: "Food & Beverages" },
    { value: "Tech", label: "Technology & Electronics" },
    { value: "Other", label: "Other" }
  ];

  const floors = [
    { value: "G", label: "Ground Floor (G)" },
    { value: "L1", label: "Level 1 (L1)" },
    { value: "L2", label: "Level 2 (L2)" },
    { value: "L3", label: "Level 3 (L3)" },
    { value: "L5", label: "Level 5 (L5)" }
  ];

  // Generate stall numbers based on selected floor
  const getStallNumbers = (floorCode) => {
    if (!floorCode) return [];
    
    const stalls = [];
    for (let i = 1; i <= 10; i++) {
      const stallNumber = `${floorCode}-${i.toString().padStart(2, '0')}`;
      stalls.push({ value: stallNumber, label: stallNumber });
    }
    return stalls;
  };

  const availableStalls = getStallNumbers(formData.floorNumber);

  useEffect(() => {
    if (user?.userType !== 'seller') {
      navigate('/');
      return;
    }
    fetchShopData();
  }, [user, navigate]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/shops/my-shop', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const shopData = data.shop;
        setShop(shopData);
        
        // Populate form with existing data
        setFormData({
          shopName: shopData.shopName || '',
          category: shopData.category || '',
          stallNumber: shopData.stallNumber || '',
          floorNumber: shopData.floorNumber || '',
          description: shopData.description || '',
          shopLogo: null // File input will be empty initially
        });
        
        // Set logo preview if exists
        if (shopData.shopLogo) {
          setLogoPreview(shopData.shopLogo);
        }
      } else {
        toast.error('Failed to load shop data');
        navigate('/seller/dashboard');
      }
    } catch (error) {
      toast.error('Failed to load shop data');
      navigate('/seller/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview for new logo
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        
        // Reset stall number if floor changes
        if (name === 'floorNumber') {
          newData.stallNumber = '';
        }
        
        return newData;
      });
    }
  };

  const validateForm = () => {
    if (!formData.shopName.trim()) {
      toast.error('Shop name is required');
      return false;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.floorNumber) {
      toast.error('Floor is required');
      return false;
    }
    if (!formData.stallNumber) {
      toast.error('Stall is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Prepare update data
      const updateData = {
        shopName: formData.shopName,
        category: formData.category,
        stallNumber: formData.stallNumber,
        floorNumber: formData.floorNumber,
        description: formData.description
      };

      // If a new logo is selected, convert to base64
      if (formData.shopLogo) {
        updateData.shopLogo = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(formData.shopLogo);
        });
      }

      const response = await fetch('http://localhost:3000/api/shops/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        toast.success('Shop updated successfully!');
        navigate('/seller/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update shop');
      }
    } catch (error) {
      toast.error('Failed to update shop');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Shop Not Found</h2>
            <p className="mt-4 text-lg text-gray-500">
              Unable to find your shop details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="mb-4 text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Shop Details</h1>
          <p className="mt-2 text-gray-600">Update your shop information</p>
        </div>

        {/* Edit Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Name */}
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                Shop Name *
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Floor and Stall */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="floorNumber" className="block text-sm font-medium text-gray-700">
                  Floor *
                </label>
                <select
                  id="floorNumber"
                  name="floorNumber"
                  value={formData.floorNumber}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Floor</option>
                  {floors.map((floor) => (
                    <option key={floor.value} value={floor.value}>
                      {floor.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="stallNumber" className="block text-sm font-medium text-gray-700">
                  Stall *
                </label>
                <select
                  id="stallNumber"
                  name="stallNumber"
                  value={formData.stallNumber}
                  onChange={handleChange}
                  required
                  disabled={!formData.floorNumber}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {formData.floorNumber ? 'Select Stall' : 'Select Floor First'}
                  </option>
                  {availableStalls.map((stall) => (
                    <option key={stall.value} value={stall.value}>
                      {stall.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your shop..."
              />
            </div>

            {/* Shop Logo */}
            <div>
              <label htmlFor="shopLogo" className="block text-sm font-medium text-gray-700">
                Shop Logo
              </label>
              <div className="mt-1 flex items-center space-x-4">
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Shop logo preview"
                    className="h-16 w-16 object-cover rounded-lg border border-gray-300"
                  />
                )}
                <input
                  type="file"
                  id="shopLogo"
                  name="shopLogo"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to keep current logo. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/seller/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditShop;
