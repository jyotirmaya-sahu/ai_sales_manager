'use client';

import * as React from 'react';
import ThemeRegistry from '@/lib/mui/ThemeRegistry';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import ViewWeekIcon from '@mui/icons-material/ViewWeek'; // Represents List View
import ViewWeekOutlinedIcon from '@mui/icons-material/ViewWeekOutlined';
import AppSidebar from '@/components/AppSidebar';
import CallList from '@/components/CallList';


const useMediaQuery = () => {
    const [disableSideBar, setDisableSideBar] = React.useState(false);

    React.useEffect(() => {
        const mediaQueryList = window.matchMedia("(width <= 1220px)");
        mediaQueryList.addListener(e => setDisableSideBar(e.matches));

        setDisableSideBar(mediaQueryList.matches);
        return () => {
            mediaQueryList.removeListener(e => setDisableSideBar(e.matches));
        };
    }, []);
    return { disableSideBar };
};


export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showSidebar, setShowSidebar] = React.useState(true);
    const [showCallList, setShowCallList] = React.useState(true);
    const { disableSideBar } = useMediaQuery();

    React.useEffect(() => {
        setShowSidebar(!disableSideBar);
        setShowCallList(!disableSideBar);
    }, [disableSideBar]);

    return (
        <ThemeRegistry>
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
                {/* Column 1: Sidebar */}
                <Box sx={{ display: showSidebar ? 'block' : 'none' }}>
                    <AppSidebar />
                </Box>

                {/* Column 2: Call List */}
                <Box sx={{ display: showCallList && pathname !== '/app/trends' ? 'block' : 'none' }}>
                    <CallList />
                </Box>

                {/* Column 3: Detail View (Dynamic) */}
                <Box component="main" sx={{ flexGrow: 1, height: '100%', overflow: 'hidden', bgcolor: 'background.paper', position: 'relative', display: 'flex', flexDirection: 'column' }}>

                    {/* Toggle Bar */}
                    <Box sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 1200,
                        display: 'flex',
                        gap: 1,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 2,
                        p: 0.5,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                        <Tooltip title="Toggle Sidebar">
                            <IconButton onClick={() => setShowSidebar(!showSidebar)} size="small">
                                {showSidebar ? <ViewSidebarIcon fontSize="small" /> : <ViewSidebarOutlinedIcon fontSize="small" sx={{ opacity: 0.5 }} />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Toggle List">
                            <span>
                                <IconButton
                                    onClick={() => setShowCallList(!showCallList)}
                                    size="small"
                                    disabled={pathname === '/app/trends'}
                                    sx={{ opacity: pathname === '/app/trends' ? 0.3 : 1 }}
                                >
                                    {showCallList ? <ViewWeekIcon fontSize="small" /> : <ViewWeekOutlinedIcon fontSize="small" sx={{ opacity: 0.5 }} />}
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>

                    {children}
                </Box>
            </Box>
        </ThemeRegistry>
    );
}
