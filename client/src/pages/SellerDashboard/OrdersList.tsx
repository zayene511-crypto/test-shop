import React, { useState, useEffect } from 'react';
import { Phone, MapPin, User, Clock } from 'lucide-react';
import { api } from '../../services/api';

const OrdersList: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const data = await api.getSellerOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: number, status: string) => {
        await api.updateOrderStatus(orderId, status);
        fetchOrders();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-600';
            case 'processing': return 'bg-blue-100 text-blue-600';
            case 'shipped': return 'bg-purple-100 text-purple-600';
            case 'delivered': return 'bg-green-100 text-green-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-4">
            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No orders found.</div>
            ) : orders.map((order) => (
                <div key={order.id} className="mobile-card">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-black text-gray-800">#{order.id}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(order.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-800">{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{order.customer_phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="line-clamp-1">{order.customer_address}</span>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-2">
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className="bg-gray-50 px-2 py-1 rounded text-[10px] text-gray-500 border border-gray-100">
                                    {item.product_name} x {item.quantity}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Total Payout</span>
                            <span className="font-bold text-primary">${order.total_amount}</span>
                        </div>
                        <select
                            className="bg-white border border-gray-200 rounded-lg text-xs font-bold py-1.5 px-3 focus:outline-none"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrdersList;
