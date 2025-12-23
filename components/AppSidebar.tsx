'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import TimelineIcon from '@mui/icons-material/Timeline';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname } from 'next/navigation';

export default function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const [loading, setLoading] = React.useState(false);

    const handleNewCall = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Redirect to login if checking user fails or no user
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('calls')
                .insert({
                    title: 'New Untitled Call',
                    user_id: user.id
                })
                .select()
                .single();

            if (error) throw error;

            // Trigger refresh for CallList
            window.dispatchEvent(new Event('sales-manager:refresh-calls'));

            router.push(`/app/${data.id}`);
        } catch (err: any) {
            console.error('Error creating call:', err);
            // For MVP, alerting on error is acceptable
            alert('Failed to create call: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <Box
            sx={{
                width: 250,
                height: '100%',
                borderRight: '1px solid',
                borderColor: 'divider',
                bgcolor: '#fbfbfd',
                display: 'flex',
                flexDirection: 'column',
                pt: 2
            }}
        >
            <Box sx={{ px: 3, mb: 3 }}>
                <Typography variant="body2" fontWeight="600" color="text.secondary">
                    SALES MANAGER
                </Typography>
            </Box>

            <List sx={{ px: 2 }}>
                <ListItemButton
                    selected={pathname === '/app'}
                    onClick={() => router.push('/app')}
                    sx={{ borderRadius: 2, mb: 0.5 }}
                >
                    <DescriptionIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1.5 }} />
                    <ListItemText
                        primary="All Calls"
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                    />
                </ListItemButton>

                <ListItemButton
                    selected={pathname === '/app/trends'}
                    onClick={() => router.push('/app/trends')}
                    sx={{ borderRadius: 2 }}
                >
                    <TimelineIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1.5 }} />
                    <ListItemText
                        primary="Trends"
                        primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
                    />
                </ListItemButton>
            </List>

            <Box sx={{ mt: 'auto', p: 2 }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleNewCall}
                    disabled={loading}
                    startIcon={loading ? null : <AddIcon />}
                    sx={{
                        backgroundColor: '#1c1c1e',
                        borderRadius: 2,
                        height: 40,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#3a3a3c' },
                        mb: 1
                    }}
                >
                    {loading ? 'Creating...' : 'New Call'}
                </Button>

                <Button
                    fullWidth
                    onClick={handleLogout}
                    startIcon={<LogoutIcon sx={{ fontSize: 20 }} />}
                    sx={{
                        color: 'text.secondary',
                        borderRadius: 2,
                        height: 40,
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        px: 2,
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
                    }}
                >
                    Sign Out
                </Button>
            </Box>
        </Box>
    );
}
