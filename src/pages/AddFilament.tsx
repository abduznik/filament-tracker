import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db';
import { Upload, ChevronLeft, Save } from 'lucide-react';

export const AddFilament: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('PLA');
  const [weight, setWeight] = useState(1000);
  const [cost, setCost] = useState(20);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await db.addFilament({
        brand,
        color,
        material,
        weight: Number(weight),
        initialWeight: Number(weight),
        cost: Number(cost),
        purchaseDate: new Date(),
        photo: photo || undefined
      });
      navigate('/');
    } catch (error) {
      console.error("Failed to add filament:", error);
      alert("Error adding filament. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
        <ChevronLeft size={20} />
        Back
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Filament</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track a new spool in your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div className="flex justify-center">
            <div className="relative group cursor-pointer">
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${preview ? 'border-white dark:border-gray-700 shadow-lg' : 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'} flex items-center justify-center transition hover:border-blue-400 dark:hover:border-blue-500`}>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="text-gray-400 dark:text-gray-600" size={32} />
                )}
              </div>
              <input 
                type="file" 
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="text-center mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                {preview ? 'Change Photo' : 'Upload Photo'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Brand</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition"
                placeholder="e.g. Prusament"
                value={brand}
                onChange={e => setBrand(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Color</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition"
                placeholder="e.g. Galaxy Black"
                value={color}
                onChange={e => setColor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Material</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition"
                value={material}
                onChange={e => setMaterial(e.target.value)}
              >
                <option>PLA</option>
                <option>PETG</option>
                <option>ABS</option>
                <option>ASA</option>
                <option>TPU</option>
                <option>Nylon</option>
                <option>PC</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight (g)</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition"
                placeholder="1000"
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cost (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition"
                  placeholder="20.00"
                  value={cost}
                  onChange={e => setCost(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition active:scale-[0.98] flex justify-center items-center gap-2"
            >
              {loading ? 'Saving...' : <><Save size={20} /> Save Filament</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};