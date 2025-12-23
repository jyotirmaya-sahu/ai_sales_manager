'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isSignUp, setIsSignUp] = React.useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Auto-login or show message often handled by Supabase, 
                // but for simple email/pass without confirm (if disabled), it works.
                // If email confirm is ON, this might pause. Assuming dev mode/no confirm for MVP.
                alert('Check your email for confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/app');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            sx={{
                width: '100%',
                maxWidth: 400,
                p: 4,
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Box sx={{ mb: 1, textAlign: 'center' }}>
                <Typography variant="h5" component="h1" fontWeight="700" color="primary">
                    Sales Manager
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {isSignUp ? 'Create a new account' : 'Sign in to your workspace'}
                </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleAuth} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{
                        mt: 1,
                        height: 48,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        backgroundColor: '#1c1c1e',
                        '&:hover': { backgroundColor: '#3a3a3c' }
                    }}
                >
                    {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>

                <Button
                    variant="text"
                    onClick={() => setIsSignUp(!isSignUp)}
                    sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.9rem' }}
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'No account? Create one'}
                </Button>
            </Box>
        </Card>
    );
}
