export interface BusinessItem {
  id: string;
  name: string;
  stock: number;
  capitalPrice: number; // Harga Modal (HPP)
  sellingPrice: number; // Harga Jual
  category: string;
}

export interface BusinessMetrics {
  totalCapital: number; // Total Modal Aset
  totalPotentialRevenue: number; // Potensi Omzet
  totalPotentialProfit: number; // Potensi Keuntungan Total
  totalItems: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
