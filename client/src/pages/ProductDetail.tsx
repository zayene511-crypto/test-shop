import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { api, BASE_URL } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await api.getProductById(Number(id));
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!product) return <div className="p-10 text-center">Product not found</div>;

    return (
        <div className="bg-white -mx-4 -mt-2 min-h-screen">
            <div className="relative h-96 bg-gray-100">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full shadow-md"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <img
                    src={product.image_url ? `${BASE_URL}${product.image_url}` : 'https://placehold.co/600?text=Product'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                    <div className="text-2xl font-black text-golden mt-1">${Number(product.price).toFixed(2)}</div>
                </div>

                <div className="text-gray-600 text-sm leading-relaxed border-b border-gray-100 pb-4">
                    {product.description || 'No description available for this product.'}
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">Quantity</span>
                    <div className="flex items-center gap-4 bg-gray-100 p-1 rounded-full">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-4 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => {
                        addToCart(product, quantity);
                        showToast("Item added to cart");
                        navigate('/cart');
                    }}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart - <span className="text-golden ml-1">${(product.price * quantity).toFixed(2)}</span>
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
