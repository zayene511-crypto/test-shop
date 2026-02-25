import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BottomNavbar: React.FC = () => {
    const { totalItems } = useCart();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-12 py-2 flex justify-around items-center z-50">
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home className="w-6 h-6" />
                <span>Home</span>
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {totalItems}
                        </span>
                    )}
                </div>
                <span>Cart</span>
            </NavLink>
        </nav>
    );
};

export default BottomNavbar;
