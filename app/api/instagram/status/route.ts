import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const businessId = process.env.INSTAGRAM_BUSINESS_ID;
    const pageToken = process.env.INSTAGRAM_PAGE_TOKEN;

    if (!businessId || !pageToken) {
        return NextResponse.json({
            connected: false,
            hasBusinessId: !!businessId,
            hasPageToken: !!pageToken,
            account: null,
        });
    }

    try {
        const res = await fetch(
            `https://graph.facebook.com/v18.0/${businessId}?fields=name,username,followers_count,media_count,profile_picture_url&access_token=${pageToken}`
        );
        const data = await res.json();

        if (data.error) {
            return NextResponse.json({
                connected: false,
                hasBusinessId: true,
                hasPageToken: true,
                error: data.error.message,
                account: null,
            });
        }

        return NextResponse.json({
            connected: true,
            hasBusinessId: true,
            hasPageToken: true,
            account: {
                id: data.id,
                name: data.name,
                username: data.username,
                followers: data.followers_count ?? 0,
                posts: data.media_count ?? 0,
            },
        });
    } catch {
        return NextResponse.json({
            connected: false,
            hasBusinessId: true,
            hasPageToken: true,
            error: 'Error al contactar la API de Meta',
            account: null,
        });
    }
}
