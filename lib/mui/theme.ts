'use client';

import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

// Apple-like design tokens
const palette = {
    primary: '#1c1c1e', // System Black
    secondary: '#8e8e93', // System Gray
    background: '#f5f5f7', // System Gray 6 (Base background)
    paper: '#ffffff',
    divider: 'rgba(0, 0, 0, 0.08)',
    error: '#ff3b30',
    success: '#34c759',
};

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: palette.primary,
        },
        secondary: {
            main: palette.secondary,
        },
        error: {
            main: palette.error,
        },
        success: {
            main: palette.success,
        },
        background: {
            default: palette.background,
            paper: palette.paper,
        },
        divider: palette.divider,
        text: {
            primary: palette.primary,
            secondary: palette.secondary,
        },
    },
    typography: {
        fontFamily: inter.style.fontFamily,
        button: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '-0.01em',
        },
        h1: { letterSpacing: '-0.02em', fontWeight: 700 },
        h2: { letterSpacing: '-0.02em', fontWeight: 600 },
        h3: { letterSpacing: '-0.02em', fontWeight: 600 },
        h4: { letterSpacing: '-0.02em', fontWeight: 600 },
        h5: { letterSpacing: '-0.01em', fontWeight: 600 },
        h6: { letterSpacing: '-0.01em', fontWeight: 600 },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: 'none',
                    padding: '8px 16px',
                    '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                    },
                },
                containedPrimary: {
                    color: '#ffffff',
                    '&:hover': {
                        backgroundColor: '#3a3a3c', // System Gray 2
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)', // Very subtle shadow
                    border: `1px solid ${palette.divider}`,
                },
                elevation0: {
                    boxShadow: 'none',
                    border: 'none',
                }
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: palette.divider,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: `1px solid ${palette.divider}`,
                    backgroundColor: '#fbfbfd', // Slightly lighter sidebar
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '2px 8px',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.08)',
                        }
                    },
                },
            },
        },
    },
});

export default theme;
