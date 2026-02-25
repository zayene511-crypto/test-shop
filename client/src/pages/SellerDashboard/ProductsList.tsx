import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { api, BASE_URL } from '../../services/api';
import ProductModal from './ProductModal';

const ProductsList: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [search, setSearch] = useState('');

    const fetchProducts = async (searchQuery = '') => {
        setLoading(true);
        try {
            const data = await api.getProducts(searchQuery);
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(search);
    }, [search]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await api.deleteProduct(id);
            fetchProducts();
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-[200px]">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-gray-100 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-primary text-white p-2 rounded-lg shadow-sm active:scale-95 transition-transform"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Loading products...</div>
                ) : products.map((product) => (
                    <div key={product.id} className="mobile-card p-3 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img src={`${BASE_URL}${product.image_url}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">${product.price} • Stock: {product.stock}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => openEditModal(product)}
                                className="p-2 text-blue-500 bg-blue-50 rounded-lg"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-red-500 bg-red-50 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        setModalOpen(false);
                        fetchProducts();
                    }}
                />
            )}
        </div>
    );
};

export default ProductsList;
