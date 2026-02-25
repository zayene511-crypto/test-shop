import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BASE_URL } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useToast();

    return (
        <div className="mobile-card flex flex-col h-full">
            <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={product.image_url ? `${BASE_URL}${product.image_url}` : 'https://placehold.co/300?text=Product'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </Link>
            <div className="p-3 flex flex-col flex-1">
                <h3 className="text-sm font-medium line-clamp-2 mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.category_name}</p>
                <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-golden">${Number(product.price).toFixed(2)}</span>
                    <button
                        onClick={() => {
                            addToCart(product, 1);
                            showToast("Item added to cart");
                        }}
                        className="bg-primary text-white p-1.5 rounded-full shadow-md active:scale-95 transition-transform"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
