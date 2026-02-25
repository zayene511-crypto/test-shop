import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';

const StatsOverview: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getSellerStats();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading stats...</div>;

    const cards = [
        { title: 'Total Sales', value: `$${Number(stats?.total_sales || 0).toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500' },
        { title: 'Total Orders', value: stats?.total_orders || 0, icon: ShoppingBag, color: 'bg-blue-500' },
        { title: 'Products', value: stats?.total_products || 0, icon: Package, color: 'bg-orange-500' },
        { title: 'Conversion', value: '3.2%', icon: TrendingUp, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className="mobile-card p-4 flex flex-col gap-3">
                        <div className={`${card.color} text-white w-8 h-8 rounded-lg flex items-center justify-center`}>
                            <card.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">{card.title}</p>
                            <h3 className="text-xl font-black text-gray-800">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mobile-card p-4 h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 border border-dashed border-gray-200">
                <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">Sales chart (Visualisation placeholder)</p>
            </div>
        </div>
    );
};

export default StatsOverview;
