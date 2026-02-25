import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNavbar from './BottomNavbar';

const Layout: React.FC = () => {
    const location = useLocation();
    const isSellerPath = location.pathname.startsWith('/seller');

    return (
        <div className={`flex flex-col min-height-screen ${isSellerPath ? '' : 'pb-20'}`}>
            {!isSellerPath && <Header />}
            <main className={`flex-1 ${isSellerPath ? '' : 'px-4 py-2'}`}>
                <Outlet />
            </main>
            {!isSellerPath && <BottomNavbar />}
        </div>
    );
};

export default Layout;
