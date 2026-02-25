/**
 * Utility to initialize and manage the Telegram Mini App environment.
 */
export function initTelegramApp() {
    // Check if the app is running within Telegram
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        // Notify Telegram that the app is ready
        tg.ready();

        // Expand the app to take up the full available height
        tg.expand();

        // Apply Telegram theme colors dynamically if available
        if (tg.themeParams) {
            if (tg.themeParams.bg_color) {
                document.body.style.backgroundColor = tg.themeParams.bg_color;
            }
            if (tg.themeParams.text_color) {
                document.body.style.color = tg.themeParams.text_color;
            }
        }

        console.log('Telegram Mini App initialized');
    } else {
        console.log('Not running inside Telegram');
    }
}

// Global declaration for TypeScript support
declare global {
    interface Window {
        Telegram?: {
            WebApp: any;
        };
    }
}
