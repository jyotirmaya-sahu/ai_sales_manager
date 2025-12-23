'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function AppEmptyPage() {
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                p: 4,
                textAlign: 'center'
            }}
        >
            <Box sx={{ p: 3, borderRadius: '50%', bgcolor: 'action.hover', mb: 3 }}>
                <AnalyticsIcon sx={{ fontSize: 48, opacity: 0.5 }} />
            </Box>
            <Typography variant="h6" gutterBottom fontWeight="600">
                No Call Selected
            </Typography>
            <Typography variant="body2" maxWidth={300}>
                Select a call from the list to view notes, or create a new call to start analyzing.
            </Typography>
        </Box>
    );
}
