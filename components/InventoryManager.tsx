import React, { useState } from 'react';
import { Plus, Trash2, Search, Edit2 } from 'lucide-react';
import { BusinessItem } from '../types';

interface InventoryManagerProps {
  items: BusinessItem[];
  onAddItem: (item: BusinessItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem: (item: BusinessItem) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ items, onAddItem, onDeleteItem, onUpdateItem }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [capital, setCapital] = useState('');
  const [selling, setSelling] = useState('');
  const [category, setCategory] = useState('');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const resetForm = () => {
    setName('');
    setStock('');
    setCapital('');
    setSelling('');
    setCategory('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: BusinessItem = {
      id: editingId || Date.now().toString(),
      name,
      stock: parseInt(stock) || 0,
      capitalPrice: parseFloat(capital) || 0,
      sellingPrice: parseFloat(selling) || 0,
      category: category || 'Umum',
    };

    if (editingId) {
      onUpdateItem(newItem);
    } else {
      onAddItem(newItem);
    }
    resetForm();
  };

  const handleEdit = (item: BusinessItem) => {
    setName(item.name);
    setStock(item.stock.toString());
    setCapital(item.capitalPrice.toString());
    setSelling(item.sellingPrice.toString());
    setCategory(item.category);
    setEditingId(item.id);
    setShowForm(true);
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Daftar Stok Barang</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Tambah Barang
        </button>
      </div>

      {/* Add/Edit Form Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Barang</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Kopi Susu Gula Aren" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Minuman" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stok (Pcs)</label>
                  <input required type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Modal (HPP)</label>
                  <input required type="number" value={capital} onChange={e => setCapital(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Rp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual</label>
                  <input required type="number" value={selling} onChange={e => setSelling(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Rp" />
                </div>
              </div>
              
              <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-700 flex justify-between">
                <span>Estimasi Laba/pcs:</span>
                <span className="font-bold">
                  {formatRupiah((parseFloat(selling) || 0) - (parseFloat(capital) || 0))}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Cari nama barang atau kategori..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
        />
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Barang</th>
                <th className="p-4 font-semibold text-center">Stok</th>
                <th className="p-4 font-semibold text-right">Modal</th>
                <th className="p-4 font-semibold text-right">Jual</th>
                <th className="p-4 font-semibold text-right text-emerald-600">Laba/Unit</th>
                <th className="p-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Belum ada data barang.</td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-indigo-50/30 transition group">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.category}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-600">{formatRupiah(item.capitalPrice)}</td>
                    <td className="p-4 text-right text-slate-900 font-medium">{formatRupiah(item.sellingPrice)}</td>
                    <td className="p-4 text-right text-emerald-600 font-bold">
                      {formatRupiah(item.sellingPrice - item.capitalPrice)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                         <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteItem(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
