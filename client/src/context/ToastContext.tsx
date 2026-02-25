import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string | null>(null);

    const showToast = useCallback((msg: string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {message && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
                    <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold whitespace-nowrap">
                        <span className="text-xl">✅</span>
                        {message}
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};
