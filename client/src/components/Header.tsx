import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(search ? `/?search=${search}` : '/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center gap-3">
            <Link to="/" className="text-xl font-bold text-primary shrink-0">Godzilla Farmz</Link>

            <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={search}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSearch(val);
                        navigate(val ? `/?search=${val}` : '/');
                    }}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            </form>
        </header>
    );
};

export default Header;
