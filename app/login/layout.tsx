'use client';

import ThemeRegistry from '@/lib/mui/ThemeRegistry';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeRegistry>
            <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
                {children}
            </div>
        </ThemeRegistry>
    );
}
