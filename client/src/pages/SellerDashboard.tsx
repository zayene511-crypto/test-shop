import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StatsOverview from './SellerDashboard/StatsOverview';
import ProductsList from './SellerDashboard/ProductsList';
import OrdersList from './SellerDashboard/OrdersList';

const SellerDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        navigate('/seller/login');
        return null;
    }

    return (
        <div className="space-y-6 pt-6 px-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-xs text-gray-500">Welcome back, {user.name}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <NavLink
                    to="/seller/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                        }`
                    }
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Overview
                </NavLink>
                <NavLink
                    to="/seller/dashboard/products"
                    className={({ isActive }) =>
                        `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                        }`
                    }
                >
                    <Package className="w-4 h-4" />
                    Products
                </NavLink>
                <NavLink
                    to="/seller/dashboard/orders"
                    className={({ isActive }) =>
                        `flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${isActive ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
                        }`
                    }
                >
                    <ShoppingCart className="w-4 h-4" />
                    Orders
                </NavLink>
            </div>

            <div className="pb-10">
                <Routes>
                    <Route index element={<StatsOverview />} />
                    <Route path="products" element={<ProductsList />} />
                    <Route path="orders" element={<OrdersList />} />
                </Routes>
            </div>
        </div>
    );
};

export default SellerDashboard;
