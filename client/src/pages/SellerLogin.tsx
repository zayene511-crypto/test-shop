import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SellerLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.login({ email, password });
            if (res.token) {
                login(res.token, res.user);
                navigate('/seller/dashboard');
            } else {
                setError(res.message || 'Login failed');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'An error occurred. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80dvh] flex flex-col justify-center">
            <div className="relative text-center space-y-2 mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="absolute left-0 top-0 p-2 text-gray-400 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="bg-primary text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/30">
                    <Store className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Seller Portal</h1>
                <p className="text-gray-500 text-sm">Sign in to manage your store</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="email"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                placeholder="seller@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                                required
                                type="password"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? 'Signing in...' : 'Login'}
                </button>

                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        Forgot password? Contact admin for reset.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SellerLogin;
