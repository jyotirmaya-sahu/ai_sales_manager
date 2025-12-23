'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

interface TrendData {
    objectionTrend: string;
    qualityTrend: string;
    repTrend: string;
}

export default function TrendsView() {
    const supabase = createClient();
    const [trends, setTrends] = React.useState<TrendData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

    React.useEffect(() => {
        const calculateTrends = async () => {
            const { data: user } = await supabase.auth.getUser();
            if (!user.user) return;

            const { data: calls } = await supabase
                .from('calls')
                .select(`
                    id, 
                    created_at, 
                    representative_id, 
                    representatives (name),
                    call_notes (ai_output)
                `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (!calls || calls.length < 3) {
                setStatusMessage("Not enough calls to generate trends. Create at least 3 calls.");
                setLoading(false);
                return;
            }

            const analyzedCalls = calls.filter(c => c.call_notes && c.call_notes[0]?.ai_output?.call_grade);

            if (analyzedCalls.length < 3) {
                setStatusMessage("Not enough analyzed calls. Run AI analysis on at least 3 calls to see trends.");
                setLoading(false);
                return;
            }


            const total = analyzedCalls.length;

            // 1. Objection Trend
            const objectionCounts: Record<string, number> = {};
            analyzedCalls.forEach(c => {
                const objections = c.call_notes[0].ai_output.objections || [];
                objections.forEach((obj: string) => {
                    // Normalize simple text
                    const key = obj.toLowerCase().includes('price') || obj.includes('expensive') ? 'Pricing' :
                        obj.toLowerCase().includes('competitor') ? 'Competition' :
                            obj.toLowerCase().includes('timing') ? 'Timing' :
                                obj.toLowerCase().includes('authority') ? 'Authority' : 'Other';
                    if (key !== 'Other') objectionCounts[key] = (objectionCounts[key] || 0) + 1;
                });
            });

            let topObjection = '';
            let topObjectionCount = 0;
            Object.entries(objectionCounts).forEach(([k, v]) => {
                if (v > topObjectionCount) {
                    topObjection = k;
                    topObjectionCount = v;
                }
            });

            const objectionTrend = topObjection
                ? `${topObjection} objections appeared in ${topObjectionCount} of the last ${total} calls.`
                : "No dominant objection patterns detected recently.";


            // 2. Call Quality Trend
            const gradeCounts: Record<string, number> = { 'Strong': 0, 'Okay': 0, 'Needs Improvement': 0 };
            const reasons: Record<string, string[]> = { 'Strong': [], 'Okay': [], 'Needs Improvement': [] };

            analyzedCalls.forEach(c => {
                const grade = c.call_notes[0].ai_output.call_grade;
                if (gradeCounts[grade] !== undefined) {
                    gradeCounts[grade]++;
                    if (c.call_notes[0].ai_output.grade_reason) {
                        reasons[grade].push(...c.call_notes[0].ai_output.grade_reason);
                    }
                }
            });

            let qualityTrend = "Call quality has been mixed recently.";
            if (gradeCounts['Needs Improvement'] >= Math.ceil(total * 0.3)) {
                // Pick a random reason from the pool
                const randomReason = reasons['Needs Improvement'][0] || "missed opportunities";
                // Simplify reason (take first 5 words)
                const simplifiedReason = randomReason.split(' ').slice(0, 6).join(' ') + '...';
                qualityTrend = `Several recent calls were graded "Needs Improvement", often related to: "${simplifiedReason}"`;
            } else if (gradeCounts['Strong'] >= Math.ceil(total * 0.5)) {
                qualityTrend = "Recent performance is strong, with consistent effective objection handling.";
            } else if (gradeCounts['Okay'] >= Math.ceil(total * 0.5)) {
                qualityTrend = "Most recent calls are graded as 'Okay', showing steady but average performance.";
            }

            // 3. Rep Observation
            const repMap: Record<string, any[]> = {};
            analyzedCalls.forEach((c: any) => {
                // Supabase returns relations as objects if single, or arrays.
                // representative_id is singular, so representatives should be an object usually, or array of 1.
                const repData = c.representatives;
                const repName = Array.isArray(repData) ? repData[0]?.name : repData?.name;

                if (repName) {
                    if (!repMap[repName]) repMap[repName] = [];
                    repMap[repName].push(c);
                }
            });

            // Find rep with most calls
            let topRepName = '';
            let maxRepCalls = 0;
            Object.entries(repMap).forEach(([name, calls]) => {
                if (calls.length > maxRepCalls) {
                    maxRepCalls = calls.length;
                    topRepName = name;
                }
            });

            let repTrend = "Sales representatives are showing varied activity levels.";
            if (topRepName) {
                const repCalls = repMap[topRepName];
                // Check their grades
                const goodCalls = repCalls.filter(c => c.call_notes[0].ai_output.call_grade === 'Strong').length;
                const badCalls = repCalls.filter(c => c.call_notes[0].ai_output.call_grade === 'Needs Improvement').length; // Fixed index

                if (goodCalls > repCalls.length / 2) {
                    repTrend = `${topRepName}'s recent calls show strong engagement and effective deal progression.`;
                } else if (badCalls > 0) {
                    // Find their specific issue
                    repTrend = `${topRepName}'s recent calls indicate meaningful activity, though some coaching on objections may be needed.`;
                } else {
                    repTrend = `${topRepName} has been the most active representative recently.`;
                }
            }

            setTrends({ objectionTrend, qualityTrend, repTrend });
            setStatusMessage(null);
            setLoading(false);
        };

        calculateTrends();
    }, [supabase]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={20} sx={{ color: 'text.secondary' }} />
        </Box>
    );

    if (!trends || (!trends.objectionTrend && !trends.qualityTrend)) return (
        <Box sx={{ maxWidth: 600, width: '100%', mb: 6, textAlign: 'center', p: 4 }}>
            <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                No Trends Available Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {statusMessage || "Start creating notes and running AI analysis to see trends appear here."}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ maxWidth: 600, width: '100%', mb: 6 }}>
            <Typography variant="h6" fontWeight="600" color="text.primary" gutterBottom>
                Recent Trends
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Based on your last few calls
            </Typography>

            <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                <Box component="ul" sx={{ pl: 2, m: 0, '& li': { mb: 2, color: 'text.secondary', lineHeight: 1.6 } }}>
                    <li>
                        <Typography variant="body1" color="text.primary" component="span" fontWeight="500">
                            Objections:
                        </Typography>{' '}
                        {trends.objectionTrend}
                    </li>
                    <li>
                        <Typography variant="body1" color="text.primary" component="span" fontWeight="500">
                            Quality:
                        </Typography>{' '}
                        {trends.qualityTrend}
                    </li>
                    <li>
                        <Typography variant="body1" color="text.primary" component="span" fontWeight="500">
                            Team:
                        </Typography>{' '}
                        {trends.repTrend}
                    </li>
                </Box>
            </Paper>
        </Box>
    );
}
