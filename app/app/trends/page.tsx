'use client';

import Box from '@mui/material/Box';
import TrendsView from '@/components/TrendsView';

export default function TrendsPage() {
    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: 'auto'
        }}>
            <TrendsView />
        </Box>
    );
}
