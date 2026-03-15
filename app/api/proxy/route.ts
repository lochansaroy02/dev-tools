// app/api/proxy/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // 1. Read the instructions sent from your frontend
        const { targetUrl, method, headers, body } = await request.json();

        if (!targetUrl) {
            return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
        }

        // 2. Make the actual server-to-server request (CORS does not exist here!)
        const fetchOptions: RequestInit = {
            method: method || 'GET',
            headers: headers || {},
        };

        if (method !== 'GET' && method !== 'HEAD' && body) {
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        const targetResponse = await fetch(targetUrl, fetchOptions);

        // 3. Read the response from the external API
        const responseText = await targetResponse.text();

        // Extract headers to pass them back to the frontend
        const responseHeaders: Record<string, string> = {};
        targetResponse.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        // 4. Send the data back to your frontend
        return NextResponse.json({
            status: targetResponse.status,
            statusText: targetResponse.statusText,
            headers: responseHeaders,
            data: responseText,
        }, {
            status: 200 // Always return 200 to our frontend so we can handle the target's actual status manually
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to proxy request' },
            { status: 500 }
        );
    }
}