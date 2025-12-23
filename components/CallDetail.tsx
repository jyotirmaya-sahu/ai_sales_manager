'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Stack } from '@mui/material';

interface CallDetailProps {
    callId: string;
}
// Simple Media Query Hook
const useMediaQuery = (width: number) => {
    const [targetReached, setTargetReached] = React.useState(false);
    const [disableSideBar, setDisableSideBar] = React.useState(false);

    React.useEffect(() => {
        const media = window.matchMedia(`(max-width: ${width}px)`);
        const mediaQueryList = window.matchMedia("(width <= 1220px)");
        mediaQueryList.addListener(e => setDisableSideBar(e.matches));

        media.addListener(e => setTargetReached(e.matches));
        setTargetReached(media.matches);
        setDisableSideBar(mediaQueryList.matches);
        return () => {
            media.removeListener(e => setTargetReached(e.matches));
            mediaQueryList.removeListener(e => setDisableSideBar(e.matches));
        };
    }, [width]);
    return { targetReached, disableSideBar };
};

export default function CallDetail({ callId }: CallDetailProps) {
    const supabase = createClient();
    const [rawText, setRawText] = React.useState('');
    const [analysis, setAnalysis] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false); // Analyzer
    const [fetching, setFetching] = React.useState(true); // Initial Load
    const [callTitle, setCallTitle] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'raw' | 'ai'>('raw');


    const { targetReached: isMobile } = useMediaQuery(900);

    // Rep State
    const [reps, setReps] = React.useState<any[]>([]);
    const [selectedRepId, setSelectedRepId] = React.useState<string | null>(null);
    const [isCreatingRep, setIsCreatingRep] = React.useState(false);
    const [newRepName, setNewRepName] = React.useState('');

    // Fetch Data on Mount
    React.useEffect(() => {
        let mounted = true;
        const loadData = async () => {
            setFetching(true);
            try {
                // Fetch Call Info
                const { data: callData } = await supabase.from('calls').select('title, representative_id').eq('id', callId).single();
                if (mounted && callData) {
                    setCallTitle(callData.title);
                    setSelectedRepId(callData.representative_id);
                }

                // Fetch Notes
                const { data: noteData } = await supabase.from('call_notes').select('*').eq('call_id', callId).maybeSingle();

                if (mounted && noteData) {
                    setRawText(noteData.raw_text || '');
                    setAnalysis(noteData.ai_output);
                }

                // Fetch Reps
                const { data: repsData } = await supabase.from('representatives').select('*').order('name');
                if (mounted && repsData) setReps(repsData);

            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setFetching(false);
            }
        };
        loadData();
        return () => { mounted = false; };
    }, [callId, supabase]);

    const createRep = async () => {
        if (!newRepName.trim()) return;
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase.from('representatives').insert({
            user_id: user.user.id,
            name: newRepName.trim()
        }).select().single();

        if (data && !error) {
            setReps([...reps, data]);
            setSelectedRepId(data.id);
            assignRep(data.id); // Assign immediately
            setIsCreatingRep(false);
            setNewRepName('');
        }
    };

    const assignRep = async (repId: string) => {
        setSelectedRepId(repId);
        await supabase.from('calls').update({ representative_id: repId }).eq('id', callId);
    };

    const handleSave = async (text: string, newAnalysis: any, explicit = false) => {
        if (explicit) setSaving(true);
        const { data: user } = await supabase.auth.getUser();
        if (!user) return;

        // Check if note exists
        const { data: existing } = await supabase.from('call_notes').select('id').eq('call_id', callId).maybeSingle();

        if (existing) {
            await supabase.from('call_notes').update({
                raw_text: text,
                ai_output: newAnalysis,
                updated_at: new Date().toISOString()
            }).eq('id', existing.id);
        } else {
            await supabase.from('call_notes').insert({
                call_id: callId,
                raw_text: text,
                ai_output: newAnalysis
            });
        }



        if (explicit) setSaving(false);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            // Find Rep Name
            const repName = reps.find(r => r.id === selectedRepId)?.name;

            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: rawText, repName }),
            });
            const data = await res.json();
            setAnalysis(data);
            await handleSave(rawText, data, false);
        } catch (error) {
            console.error('Analysis failed', error);
            alert('Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const handleBlur = () => {
        handleSave(rawText, analysis, false);
    }

    if (fetching) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CircularProgress size={30} sx={{ color: '#e5e5ea' }} />
            </Box>
        )
    }



    const renderRawInput = () => (
        <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRight: !isMobile ? '1px solid' : 'none',
            borderColor: 'divider',
            p: 0,
            height: '100%',
            overflow: 'hidden'
        }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, flexShrink: 0 }}>
                <Box sx={{ paddingLeft: isMobile ? 0 : "80px", display: 'flex', flexDirection: 'column', overflow: 'hidden', mr: 2, flex: 1 }}>
                    <TextField
                        variant="standard"
                        fullWidth
                        placeholder="Untitled Call"
                        value={callTitle}
                        onChange={(e) => setCallTitle(e.target.value)}
                        onBlur={async () => {
                            if (!callTitle.trim()) return;
                            await supabase.from('calls').update({ title: callTitle }).eq('id', callId);
                            window.dispatchEvent(new Event('sales-manager:refresh-calls'));
                        }}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                e.currentTarget.blur();
                            }
                        }}
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'text.secondary',
                                '&.Mui-focused': { color: 'text.primary' },
                                p: 0
                            }
                        }}
                        sx={{ mb: 0 }}
                    />

                    {/* Rep Selector */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <select
                            value={selectedRepId || ''}
                            onChange={(e) => {
                                if (e.target.value === 'new') {
                                    setIsCreatingRep(true); // Now triggers Dialog
                                } else {
                                    assignRep(e.target.value);
                                }
                            }}
                            style={{
                                fontSize: 12,
                                color: selectedRepId ? '#1c1c1e' : '#8e8e93',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                outline: 'none',
                                padding: 0,
                                maxWidth: 150
                            }}
                        >
                            <option value="" disabled>Select Rep</option>
                            {reps.map(rep => (
                                <option key={rep.id} value={rep.id}>{rep.name}</option>
                            ))}
                            <option disabled>──────────</option>
                            <option value="new">+ Add new rep</option>
                        </select>
                    </Box>


                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Save Button */}
                    <Button
                        size="small"
                        onClick={() => handleSave(rawText, analysis, true)}
                        sx={{ color: 'text.secondary', minWidth: 0 }}
                        startIcon={saving ? <CircularProgress size={12} color="inherit" /> : <SaveIcon fontSize="small" />}
                    >
                        {saving ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                        onClick={handleAnalyze}
                        disabled={loading || !rawText}
                        size="small"
                        sx={{
                            backgroundColor: '#1c1c1e',
                            '&:hover': { backgroundColor: '#3a3a3c' },
                            borderRadius: 20,
                            textTransform: 'none'
                        }}
                    >
                        {loading ? 'Analyzing...' : 'Analyze'}
                    </Button>
                </Box>
            </Box>
            <TextField
                multiline
                fullWidth
                variant="standard"
                placeholder="Paste call transcript or rough notes here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                onBlur={handleBlur}
                InputProps={{
                    disableUnderline: true,
                    sx: { height: '100%', p: 3, overflowY: 'scroll', alignItems: 'flex-start', fontSize: 16, fontFamily: 'monospace', lineHeight: 1.6 }
                }}
                sx={{ overflow: "scroll", flexGrow: 1, '& .MuiInputBase-root': { height: '100%' } }}
            />
        </Box>
    );

    const renderAiOutput = () => (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fbfbfd', overflowY: 'auto', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', height: 60, flexShrink: 0 }}>
                <Typography variant="subtitle2" color="text.secondary">AI INSIGHTS</Typography>
            </Box>

            {analysis ? (
                <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Call Grade Display */}
                    {analysis && analysis.call_grade && (
                        <Box sx={{ mt: 0.5, display: 'flex', flexDirection: "column", alignItems: 'flexStart' }}>
                            <Stack direction="column" gap={2}>
                                {/* <Typography variant="overline" color="text.secondary" fontWeight="700" letterSpacing={1}>Grade</Typography> */}
                                <Chip
                                    label={<><Typography sx={{ fontWeight: 600, mr: 1 }} variant="caption">Grade:</Typography><Typography variant="caption">{analysis.call_grade}</Typography></>}
                                    size="small"
                                    sx={{ width: "fit-content" }}
                                    color={analysis.call_grade === 'Strong' ? 'success' : analysis.call_grade === 'Okay' ? 'warning' : 'error'}
                                />
                            </Stack>

                            <Stack direction="column" gap={1}>
                                <Typography variant="overline" color="text.secondary" fontWeight={700}>Reason:</Typography>
                                <Stack direction="column" gap={1}>
                                    {analysis.grade_reason?.map((reason: string, i: number) => (
                                        <Typography key={i} variant="body1">{reason}</Typography>
                                    ))}
                                </Stack>
                            </Stack>
                        </Box>
                    )}

                    {/* Summary */}
                    <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" letterSpacing={1}>Summary</Typography>
                        <Typography variant="body1" lineHeight={1.8} mt={1}>{analysis.summary}</Typography>
                    </Box>

                    <Divider />

                    {/* Key Signals */}
                    <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" letterSpacing={1}>Key Signals</Typography>
                        <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
                            {analysis.key_signals?.map((signal: string, i: number) => (
                                <Typography component="li" key={i} variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>{signal}</Typography>
                            ))}
                        </Box>
                    </Box>

                    <Divider />

                    {/* Objections */}
                    <Box>
                        <Typography variant="overline" color="text.secondary" fontWeight="700" letterSpacing={1}>Objections</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            {analysis.objections?.map((tag: string, i: number) => (
                                <Chip key={i} label={tag} size="small" sx={{ borderRadius: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }} />
                            ))}
                        </Box>
                    </Box>

                    <Divider />

                    {/* Coaching Notes (NEW) */}
                    <Box>
                        <Typography variant="overline" color="primary.main" fontWeight="700" letterSpacing={1}>Coaching Notes</Typography>
                        <Paper elevation={0} sx={{ mt: 1, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                {analysis.coaching_notes?.map((note: string, i: number) => (
                                    <Typography component="li" key={i} variant="body2" sx={{ mb: 1, lineHeight: 1.6 }}>{note}</Typography>
                                ))}
                            </Box>
                        </Paper>
                    </Box>

                    <Divider />

                    {/* Next Steps */}
                    <Box>
                        <Typography variant="overline" color="success.main" fontWeight="700" letterSpacing={1}>Next Steps</Typography>
                        <Paper elevation={0} sx={{ mt: 1, borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                            {analysis.next_steps?.map((step: string, i: number) => (
                                <Box key={i} sx={{ p: 2, borderBottom: i < analysis.next_steps.length - 1 ? '1px solid' : 'none', borderColor: 'divider', display: 'flex', gap: 2, bgcolor: 'white' }}>
                                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid', borderColor: '#34c759', mt: 0.2, flexShrink: 0 }} />
                                    <Typography variant="body2">{step}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    </Box>

                </Box>
            ) : (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: 0.4 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 40, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">AI Analysis will appear here</Typography>
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', bgcolor: 'background.paper' }}>
            {/* Mobile Tabs */}
            {isMobile && (
                <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', display: 'flex' }}>
                    <Button
                        fullWidth
                        onClick={() => setActiveTab('raw')}
                        sx={{
                            borderRadius: 0,
                            borderBottom: activeTab === 'raw' ? '2px solid #1c1c1e' : 'none',
                            color: activeTab === 'raw' ? 'text.primary' : 'text.secondary',
                            py: 1.5
                        }}
                    >
                        Raw Notes
                    </Button>
                    <Button
                        fullWidth
                        onClick={() => setActiveTab('ai')}
                        sx={{
                            borderRadius: 0,
                            borderBottom: activeTab === 'ai' ? '2px solid #1c1c1e' : 'none',
                            color: activeTab === 'ai' ? 'text.primary' : 'text.secondary',
                            py: 1.5
                        }}
                    >
                        AI Insights
                    </Button>
                </Box>
            )}

            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
                {isMobile ? (
                    // Mobile: Show Active Tab
                    activeTab === 'raw' ? renderRawInput() : renderAiOutput()
                ) : (
                    // Desktop: Show Side-by-Side
                    <>
                        {renderRawInput()}
                        {renderAiOutput()}
                    </>
                )}
            </Box>

            {/* Add Rep Dialog */}
            <Dialog open={isCreatingRep} onClose={() => setIsCreatingRep(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add New Representative</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Representative Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newRepName}
                        onChange={(e: any) => setNewRepName(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') createRep();
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreatingRep(false)} color="inherit">Cancel</Button>
                    <Button onClick={createRep} disabled={!newRepName.trim()} variant="contained" sx={{ bgcolor: 'text.primary', '&:hover': { bgcolor: 'black' } }}>
                        Add Rep
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
