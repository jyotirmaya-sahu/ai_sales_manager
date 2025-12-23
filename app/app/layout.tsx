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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppSidebar from '@/components/AppSidebar';
import CallList from '@/components/CallList';
import { useRouter } from 'next/navigation';


const useMediaQuery = () => {
    const [disableSideBar, setDisableSideBar] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const mediaQueryList = window.matchMedia("(width <= 1220px)");
        const mobileQuery = window.matchMedia("(width <= 768px)");

        const handler = () => {
            setDisableSideBar(mediaQueryList.matches);
            setIsMobile(mobileQuery.matches);
        };

        mediaQueryList.addListener(handler);
        mobileQuery.addListener(handler);

        handler(); // Initial check

        return () => {
            mediaQueryList.removeListener(handler);
            mobileQuery.removeListener(handler);
        };
    }, []);
    return { disableSideBar, isMobile };
};


export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [showSidebar, setShowSidebar] = React.useState(true);
    const [showCallList, setShowCallList] = React.useState(false);
    const { disableSideBar, isMobile } = useMediaQuery();

    React.useEffect(() => {
        if (!isMobile) {
            setShowSidebar(!disableSideBar);
            setShowCallList(!disableSideBar);
        } else {
            // On mobile, default sidebar to hidden
            // setShowSidebar(false);
        }
    }, [disableSideBar, isMobile]);

    // Mobile Logic Helper
    const isRoot = pathname === '/app';

    // Calculate visibility
    const sidebarVisible = isMobile ? (isRoot && showSidebar) : showSidebar;

    // List is visible on mobile only at root AND when sidebar is NOT showing
    const listVisible = isMobile ? (isRoot && !showSidebar) : (showCallList && pathname !== '/app/trends');

    console.log({ listVisible, showCallList, pathname, sidebarVisible })
    // Main content is visible on mobile only when NOT at root
    const mainVisible = isMobile ? (!isRoot) : true;

    const router = useRouter();

    // Mobile Header Component
    const MobileHeader = () => {
        if (!isMobile) return null;

        const headerStyle = {
            position: 'sticky',
            top: 0,
            zIndex: 1200,
            width: '100%',
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            px: 2,
            height: 56, // Standard mobile toolbar height
        } as const;

        // On List View: Show Menu to open Sidebar
        if (listVisible) {
            return (
                <Box sx={headerStyle}>
                    <IconButton onClick={() => setShowSidebar(true)} edge="start">
                        <ViewSidebarIcon />
                    </IconButton>
                    <Box ml={2} fontWeight={600}>Sales Manager</Box>
                </Box>
            );
        }

        // On Detail View: Show Back to List
        if (mainVisible) {
            return (
                <Box sx={headerStyle}>
                    <IconButton onClick={() => router.push('/app')} edge="start">
                        <ArrowBackIcon />
                    </IconButton>
                    <Box ml={2} fontWeight={600}>Back</Box>
                </Box>
            );
        }

        return null; // Sidebar has its own internal nav items
    };


    return (
        <ThemeRegistry>
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
                {/* Column 1: Sidebar */}
                <Box sx={{ display: sidebarVisible ? 'block' : 'none', width: isMobile ? '100%' : 'auto', zIndex: 1300 }}>
                    <AppSidebar onNavigate={() => {
                        if (isMobile) { setShowSidebar(false); }
                        if (!showCallList) { setShowCallList(true); }
                    }} />
                </Box>

                {/* Column 2: Call List */}
                <Box sx={{ display: listVisible ? 'block' : 'none', width: isMobile ? '100%' : 'auto' }}>
                    <MobileHeader />
                    <CallList />
                </Box>

                {/* Column 3: Detail View (Dynamic) */}
                <Box component="main" sx={{
                    flexGrow: 1,
                    height: '100%',
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    display: mainVisible ? 'flex' : 'none',
                    flexDirection: 'column',
                    width: isMobile ? '100%' : 'auto'
                }}>

                    {/* Desktop Toggle Bar - Hide on Mobile since we use other nav */}
                    {!isMobile && (
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
                    )}

                    {/* Header for Detail is handled inside MobileHeader on top level if needed, but since Detail is Main, we can put it here or overlapping */}
                    <MobileHeader />

                    {children}
                </Box>
            </Box>
        </ThemeRegistry>
    );
}
