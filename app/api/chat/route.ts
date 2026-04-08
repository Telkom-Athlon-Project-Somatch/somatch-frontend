import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.KOYEB_API_URL + '/api/chat';
    const apiSecret = process.env.INTERNAL_API_SECRET;

    if (!process.env.KOYEB_API_URL) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    // Forward authorization from client
    const authHeader = request.headers.get('authorization');

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-secret': apiSecret || '',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[PROXY ERROR]', error);
    return NextResponse.json({ error: 'Failed to communicate with backend' }, { status: 500 });
  }
}
