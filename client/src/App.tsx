import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerLogin from './pages/SellerLogin';
import SellerDashboard from './pages/SellerDashboard';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <CartProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Home />} />
                                <Route path="product/:id" element={<ProductDetail />} />
                                <Route path="cart" element={<Cart />} />
                                <Route path="checkout" element={<Checkout />} />
                                <Route path="seller/login" element={<SellerLogin />} />
                                <Route path="seller/dashboard/*" element={<SellerDashboard />} />
                            </Route>
                        </Routes>
                    </CartProvider>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
