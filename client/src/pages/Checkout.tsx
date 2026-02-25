import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const Checkout: React.FC = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderItems = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const res = await api.placeOrder({
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_address: formData.address,
                items: orderItems,
                total_amount: totalPrice
            });

            if (res.orderId) {
                setOrderId(res.orderId);

                // WhatsApp Integration
                const message = `*New Order - #${res.orderId}*\n\n` +
                    `*Customer Details:*\n` +
                    `- Name: ${formData.name}\n` +
                    `- Phone: ${formData.phone}\n` +
                    `- Address: ${formData.address}\n\n` +
                    `*Order Items:*\n` +
                    cart.map(item => `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}`).join('\n') +
                    `\n\n*Total Amount: $${totalPrice.toFixed(2)}*`;

                const whatsappUrl = `https://wa.me/33621883662?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');

                clearCart();
            }
        } catch (error) {
            console.error(error);
            alert('Error placing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderId) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <CheckCircle className="w-20 h-20 text-green-500" />
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
                    <p className="text-gray-500">Transaction ID: #{orderId}</p>
                    <p className="px-10 text-sm text-gray-500">Thank you for shopping with us. We'll contact you shortly for delivery.</p>
                </div>
                <button onClick={() => navigate('/')} className="btn-primary px-8">Back to Home</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mobile-card p-4 space-y-4">
                    <h3 className="font-bold text-gray-700 border-b border-gray-100 pb-2">Customer Information</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                            <input
                                required
                                type="text"
                                className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                            <input
                                required
                                type="tel"
                                className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-primary"
                                placeholder="+1 234 567 890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Delivery Address</label>
                            <textarea
                                required
                                className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-primary h-24"
                                placeholder="123 Shopping St, Marketplace City"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="mobile-card p-4 space-y-3">
                    <h3 className="font-bold text-gray-700 border-b border-gray-100 pb-2">Order Summary</h3>
                    <div className="flex justify-between font-bold text-lg pt-2">
                        <span>Total Amount</span>
                        <span className="text-golden">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:bg-gray-300 disabled:shadow-none"
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
