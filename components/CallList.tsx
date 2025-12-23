'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

export default function CallList() {
    const router = useRouter();
    const params = useParams();
    const supabase = createClient();
    const currentId = params?.id;

    const [calls, setCalls] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchCalls = React.useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('calls')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                // Silent fail or log
                console.error(error);
            } else {
                setCalls(data || []);
            }
        } catch (err) {
            console.error('Error fetching calls:', err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    React.useEffect(() => {
        fetchCalls();

        const handleRefresh = () => fetchCalls();
        window.addEventListener('sales-manager:refresh-calls', handleRefresh);
        return () => window.removeEventListener('sales-manager:refresh-calls', handleRefresh);
    }, [fetchCalls]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Box
            sx={{
                width: 320,
                height: '100%',
                borderRight: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', height: 60, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" fontSize={16}>All Calls</Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress size={24} color="inherit" sx={{ opacity: 0.5 }} />
                </Box>
            ) : (
                <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
                    {calls.length === 0 && (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">No calls found.</Typography>
                        </Box>
                    )}
                    {calls.map((call) => (
                        <ListItemButton
                            key={call.id}
                            selected={currentId === call.id}
                            onClick={() => router.push(`/app/${call.id}`)}
                            alignItems="flex-start"
                            sx={{
                                borderRadius: 0,
                                py: 2,
                                px: 3,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                borderLeft: currentId === call.id ? '4px solid #1c1c1e' : '4px solid transparent',
                                transition: 'all 0.2s',
                                bgcolor: currentId === call.id ? 'rgba(0,0,0,0.03) !important' : 'transparent'
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" fontWeight="600" mb={0.5} noWrap>
                                        {call.title || 'Untitled Call'}
                                    </Typography>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography variant="caption" color="text.disabled" display="block" mb={0.5}>
                                            {formatDate(call.created_at)}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    );
}
