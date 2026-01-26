import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db';
import type { Filament, UsageLog } from '../types';
import { ChevronLeft, Trash2, History, Scale, DollarSign, Calendar } from 'lucide-react';

export const FilamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [filament, setFilament] = useState<Filament | null>(null);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [isUseMode, setIsUseMode] = useState(true); // true = use, false = restock

  const loadLogs = (fId: number) => {
    db.logs.where('filamentId').equals(fId).reverse().sortBy('date').then(setLogs);
  };

  useEffect(() => {
    if (id) {
      const filamentId = Number(id);
      db.filaments.get(filamentId).then(f => {
        if (f) setFilament(f);
      });
      loadLogs(filamentId);
    }
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filament || !filament.id) return;

    const change = isUseMode ? -amount : amount;
    const newWeight = filament.weight + change;

    await db.transaction('rw', db.filaments, db.logs, async () => {
      await db.filaments.update(filament.id!, { weight: newWeight });
      await db.logs.add({
        filamentId: filament.id!,
        changeAmount: change,
        date: new Date()
      });
    });

    setFilament({ ...filament, weight: newWeight });
    loadLogs(filament.id);
    setAmount(0);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this filament? This cannot be undone.')) {
        if (filament && filament.id) {
            await db.filaments.delete(filament.id);
            await db.logs.where('filamentId').equals(filament.id).delete();
            navigate('/');
        }
    }
  };

  if (!filament) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>;

  const percentage = Math.min(100, Math.max(0, (filament.weight / filament.initialWeight) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition">
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Photo & Stats */}
        <div className="space-y-6">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm relative">
                {filament.photo ? (
                    <img src={URL.createObjectURL(filament.photo)} alt="Filament" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">No Photo</div>
                )}
                 <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                 {filament.material}
               </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2"><Scale size={18} /> Initial Weight</div>
                    <span className="font-medium text-gray-900 dark:text-white">{filament.initialWeight}g</span>
                </div>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2"><DollarSign size={18} /> Cost</div>
                    <span className="font-medium text-gray-900 dark:text-white">${filament.cost}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2"><Calendar size={18} /> Purchased</div>
                    <span className="font-medium text-gray-900 dark:text-white">{filament.purchaseDate.toLocaleDateString()}</span>
                </div>
            </div>
            
            <button 
                onClick={handleDelete}
                className="w-full py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2"
            >
                <Trash2 size={16} /> Delete Filament
            </button>
        </div>

        {/* Right Column: details & Logger */}
        <div className="lg:col-span-2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{filament.color}</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">{filament.brand}</p>
            </div>

            {/* Progress */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Remaining</span>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{filament.weight}g</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out ${percentage < 20 ? 'bg-red-500' : 'bg-blue-600 dark:bg-blue-500'}`} 
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="mt-2 text-right text-sm text-gray-400 dark:text-gray-500">{percentage.toFixed(0)}% Left</div>
            </div>

            {/* Action Panel */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">Log Usage</h3>
                <div className="flex gap-2 mb-4">
                    <button 
                        onClick={() => setIsUseMode(true)}
                        className={`flex-1 py-2 rounded-lg font-medium transition ${isUseMode ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        Use (Print)
                    </button>
                    <button 
                        onClick={() => setIsUseMode(false)}
                        className={`flex-1 py-2 rounded-lg font-medium transition ${!isUseMode ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                    >
                        Restock (Add)
                    </button>
                </div>
                
                <form onSubmit={handleUpdate} className="flex gap-3">
                    <input 
                        type="number" 
                        placeholder="Amount in grams" 
                        required
                        min="1"
                        className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={amount || ''}
                        onChange={e => setAmount(Number(e.target.value))}
                    />
                    <button 
                        type="submit" 
                        className={`px-6 py-2 rounded-xl text-white font-bold shadow-md transition active:scale-95 ${
                            isUseMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isUseMode ? 'Log Print' : 'Add Stock'}
                    </button>
                </form>
            </div>

            {/* History Log */}
            <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <History size={20} /> History
                </h3>
                <div className="space-y-3">
                    {logs.map(log => (
                        <div key={log.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {log.changeAmount < 0 ? 'Print Job' : 'Restock / Adjustment'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {log.date.toLocaleString()}
                                </div>
                            </div>
                            <div className={`font-bold ${log.changeAmount < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                                {log.changeAmount > 0 ? '+' : ''}{log.changeAmount}g
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm">No history logs yet.</p>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};