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
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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

    const handleDelete = async (e: React.MouseEvent, callId: string) => {
        e.stopPropagation(); // Prevent opening the call
        if (!confirm('Are you sure you want to delete this call? This cannot be undone.')) return;

        try {
            const { error } = await supabase.from('calls').delete().eq('id', callId);
            if (error) throw error;

            setCalls(prev => prev.filter(c => c.id !== callId));
            if (currentId === callId) {
                router.push('/app');
            }
        } catch (err) {
            console.error('Error deleting call:', err);
            alert('Failed to delete call');
        }
    };

    return (
        <Box
            sx={{
                width: { xs: '100%', md: 320 },
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
                                bgcolor: currentId === call.id ? 'rgba(0,0,0,0.03) !important' : 'transparent',
                                position: 'relative',
                                '&:hover .delete-btn': { opacity: 1 }
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle2" fontWeight="600" mb={0.5} noWrap sx={{ maxWidth: '80%' }}>
                                            {call.title || 'Untitled Call'}
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography variant="caption" color="text.disabled" display="block" mb={0.5}>
                                            {formatDate(call.created_at)}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />

                            <IconButton
                                className="delete-btn"
                                size="small"
                                onClick={(e) => handleDelete(e, call.id)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    color: 'text.secondary',
                                    '&:hover': { color: 'error.main', bgcolor: 'rgba(211, 47, 47, 0.04)' }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Box>
    );
}
