'use client';
import * as React from 'react';
import CallDetail from '@/components/CallDetail';

// @ts-expect-error - Next.js Page Props
export default function CallPage({ params }) {
    const unwrappedParams = React.use(params) as { id: string };

    return (
        <CallDetail callId={unwrappedParams.id} />
    );
}
