import React from 'react';
import { Link } from 'react-router-dom';
import { Info, Mail, Phone, MapPin, Store, ChevronRight } from 'lucide-react';

const Account: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Account</h1>

            {/* Info Sections */}
            <div className="space-y-4">
                <div className="mobile-card p-4 space-y-4">
                    <h3 className="font-bold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        About Godzilla Farmz
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Godzilla Farmz is your one-stop-shop for the best products at unbeatable prices. We offer a mobile-first experience to make your shopping journey smooth and enjoyable.
                    </p>
                </div>

                <div className="mobile-card p-4 space-y-4">
                    <h3 className="font-bold text-gray-700 border-b border-gray-100 pb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        Contact & Support
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>support@testshopping.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>+1 234 567 8900</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>123 Marketplace Ave, E-commerce City</span>
                        </div>
                    </div>
                </div>

                {/* Seller Portal Link */}
                <Link
                    to="/seller/login"
                    className="mobile-card p-4 flex items-center justify-between bg-primary/5 border border-primary/10"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-primary text-white p-2 rounded-lg">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Seller Portal</h3>
                            <p className="text-xs text-gray-500">Manage your products and orders</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
            </div>

            <div className="text-center text-gray-400 text-xs py-10">
                © 2026 Godzilla Farmz. All rights reserved.
            </div>
        </div>
    );
};

export default Account;
