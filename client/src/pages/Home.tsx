import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search') || '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productsData = await api.getProducts(search);
                setProducts(productsData);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [search]);

    return (
        <div className="space-y-6">
            {/* Product Grid */}
            <section>
                <h3 className="font-bold text-golden mb-3">
                    {search ? `Results for "${search}"` : 'Popular Products'}
                </h3>
                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">No products found.</div>
                )}
            </section>
        </div>
    );
};

export default Home;
