import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../db';
import type { Filament } from '../types';
import { Plus, Search } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [filaments, setFilaments] = useState<Filament[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Simple fetch, in a real app use useLiveQuery from dexie-react-hooks
    db.filaments.toArray().then(setFilaments);
  }, []);

  const filtered = filaments.filter(f => 
    f.brand.toLowerCase().includes(search.toLowerCase()) || 
    f.color.toLowerCase().includes(search.toLowerCase()) ||
    f.material.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Filaments</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your collection and track usage</p>
        </div>
        <Link 
          to="/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 font-medium shadow-sm shadow-blue-600/20 active:scale-95 transform"
        >
          <Plus size={18} />
          Add Filament
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by brand, color, or material..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition shadow-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(f => (
          <Link key={f.id} to={`/filament/${f.id}`} className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:border-gray-700 transition overflow-hidden flex flex-col">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
               {f.photo ? (
                 <img 
                   src={URL.createObjectURL(f.photo)} 
                   alt={`${f.brand} ${f.color}`}
                   className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800/50">
                   No Photo
                 </div>
               )}
               <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-700 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-700">
                 {f.material}
               </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{f.color}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{f.brand}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                    f.weight < 100 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 
                    f.weight < 300 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {f.weight}g
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-sm text-gray-400 dark:text-gray-500">
                <span>${f.cost}</span>
                <span>{(f.weight / f.initialWeight * 100).toFixed(0)}% Left</span>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 dark:text-gray-500">
            No filaments found. <Link to="/add" className="text-blue-600 dark:text-blue-400 hover:underline">Add one?</Link>
          </div>
        )}
      </div>
    </div>
  );
};