import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BASE_URL } from '../services/api';

const Cart: React.FC = () => {
    const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="bg-gray-100 p-6 rounded-full">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500">Looks like you haven't added anything yet.</p>
                <Link to="/" className="btn-primary inline-block">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Cart ({totalItems})</h1>

            <div className="space-y-4">
                {cart.map((item) => (
                    <div key={item.id} className="mobile-card p-3 flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            <img
                                src={item.image_url ? `${BASE_URL}${item.image_url}` : 'https://placehold.co/100'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-golden">${item.price}</span>
                                <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-full">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mobile-card p-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-xl font-black text-golden">${totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Cart;
