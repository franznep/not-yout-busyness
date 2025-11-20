import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LayoutDashboard, Calculator, MessageSquareText, Menu, X } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { InventoryManager } from './components/InventoryManager';
import { AIChat } from './components/AIChat';
import { BusinessItem, BusinessMetrics } from './types';

const App: React.FC = () => {
  // --- State Management ---
  const [items, setItems] = useState<BusinessItem[]>(() => {
    const saved = localStorage.getItem('bisnisPintarItems');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('bisnisPintarItems', JSON.stringify(items));
  }, [items]);

  // --- Computations ---
  const metrics: BusinessMetrics = useMemo(() => {
    let totalCapital = 0;
    let totalPotentialRevenue = 0;
    let totalPotentialProfit = 0;

    items.forEach(item => {
      totalCapital += item.stock * item.capitalPrice;
      totalPotentialRevenue += item.stock * item.sellingPrice;
      totalPotentialProfit += item.stock * (item.sellingPrice - item.capitalPrice);
    });

    return {
      totalCapital,
      totalPotentialRevenue,
      totalPotentialProfit,
      totalItems: items.length
    };
  }, [items]);

  // Prepare data for charts
  const chartData = useMemo(() => {
    // Sort by potential profit impact
    return items
      .map(item => ({
        name: item.name,
        Profit: (item.sellingPrice - item.capitalPrice) * item.stock,
        Omzet: item.sellingPrice * item.stock
      }))
      .sort((a, b) => b.Profit - a.Profit)
      .slice(0, 10); // Top 10 items
  }, [items]);

  // --- Handlers ---
  const handleAddItem = (newItem: BusinessItem) => {
    setItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (updatedItem: BusinessItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* --- Header / Navigation --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                BisnisPintar AI
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <div className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4"/> Dashboard</div>
              </button>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${activeTab === 'inventory' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900'}`}
              >
                 <div className="flex items-center gap-2"><Calculator className="w-4 h-4"/> Stok & Harga</div>
              </button>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition shadow-md flex items-center gap-2"
              >
                <MessageSquareText className="w-4 h-4" /> Tanya AI
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 p-2">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 space-y-2">
             <button 
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </button>
              <button 
                onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              >
                Manajemen Stok
              </button>
              <button 
                onClick={() => { setIsChatOpen(true); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50"
              >
                Tanya Konsultan AI
              </button>
          </div>
        )}
      </nav>

      {/* --- Main Content --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
              <h1 className="text-3xl font-bold mb-2">Halo, Juragan!</h1>
              <p className="opacity-90 text-lg">
                Total aset modal Anda saat ini <span className="font-bold bg-white/20 px-2 py-1 rounded">{formatRupiah(metrics.totalCapital)}</span>. 
                {metrics.totalItems === 0 ? ' Ayo mulai catat barang dagangan Anda.' : ' Pastikan stok selalu aman.'}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Total Modal Aset" 
                value={formatRupiah(metrics.totalCapital)} 
                icon="box" 
                color="blue" 
              />
              <MetricCard 
                title="Potensi Omzet" 
                value={formatRupiah(metrics.totalPotentialRevenue)} 
                icon="trending" 
                color="purple" 
              />
               <MetricCard 
                title="Potensi Laba Bersih" 
                value={formatRupiah(metrics.totalPotentialProfit)} 
                icon="money" 
                color="green" 
              />
               <MetricCard 
                title="Total Jenis Barang" 
                value={metrics.totalItems.toString() + " Item"} 
                icon="chart" 
                color="orange" 
              />
            </div>

            {/* Charts Section */}
            {items.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Top 10 Barang dengan Potensi Laba Tertinggi</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                      <Tooltip 
                        cursor={{fill: '#F1F5F9'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="Omzet" fill="#818CF8" radius={[4, 4, 0, 0]} name="Potensi Omzet" />
                      <Bar dataKey="Profit" fill="#10B981" radius={[4, 4, 0, 0]} name="Potensi Laba" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="animate-fade-in">
            <InventoryManager 
              items={items} 
              onAddItem={handleAddItem} 
              onDeleteItem={handleDeleteItem}
              onUpdateItem={handleUpdateItem}
            />
          </div>
        )}

      </main>

      {/* --- AI Chat Floating Button (Mobile) --- */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition md:hidden z-30"
        >
          <MessageSquareText className="w-6 h-6" />
        </button>
      )}

      {/* --- AI Chat Sidebar --- */}
      <AIChat 
        items={items} 
        metrics={metrics} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

    </div>
  );
};

export default App;
