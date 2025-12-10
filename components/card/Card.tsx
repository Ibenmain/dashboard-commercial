import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  gradient: string;
}

export function StatsCard({ title, value, change, isPositive, gradient }: StatsCardProps) {
  return (
    <div className={`bg-linear-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group hover:scale-101 transition-transform`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
      
      <div className="relative">
        <div className="text-white/90 mb-2">{title}</div>
        <div className="mb-3">{value}</div>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-white' : 'text-white/80'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{change}</span>
          </div>
          
          <button className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
