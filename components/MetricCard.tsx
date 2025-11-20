import React from 'react';
import { ArrowUpRight, DollarSign, Package, TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: 'money' | 'chart' | 'box' | 'trending';
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'green': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'purple': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'orange': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const renderIcon = () => {
    const className = "w-6 h-6";
    switch (icon) {
      case 'money': return <DollarSign className={className} />;
      case 'chart': return <TrendingUp className={className} />;
      case 'box': return <Package className={className} />;
      case 'trending': return <ArrowUpRight className={className} />;
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${getColorClasses()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium opacity-80 uppercase tracking-wide">{title}</h3>
        <div className={`p-2 rounded-lg bg-white bg-opacity-60`}>
          {renderIcon()}
        </div>
      </div>
      <div className="text-2xl font-bold truncate">
        {value}
      </div>
    </div>
  );
};
