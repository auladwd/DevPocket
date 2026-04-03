// GET /api/entries/export?format=json|csv&ids=id1,id2,id3
// ids param is optional — if omitted, exports all entries for the user
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import EntryModel from '@/models/Entry';

export async function GET(request: NextRequest) {
  const uid = await verifyToken(request);
  if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const format = request.nextUrl.searchParams.get('format') ?? 'json';
  const idsParam = request.nextUrl.searchParams.get('ids');

  // Build query — always scoped to the authenticated user
  const query: Record<string, unknown> = { userId: uid };

  // If specific IDs are provided, export only those entries
  if (idsParam) {
    const ids = idsParam.split(',').filter(Boolean);
    if (ids.length > 0) query._id = { $in: ids };
  }

  const entries = await EntryModel.find(query)
    .select('-password -userId -__v')
    .lean();

  if (format === 'csv') {
    const headers = [
      'title',
      'content',
      'url',
      'tags',
      'pinned',
      'createdAt',
      'updatedAt',
    ];
    const rows = entries.map(e =>
      headers
        .map(h => {
          const val = (e as Record<string, unknown>)[h];
          const str = Array.isArray(val) ? val.join(';') : String(val ?? '');
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(','),
    );
    const csv = [headers.join(','), ...rows].join('\n');
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="devpocket-export.csv"',
      },
    });
  }

  return new Response(JSON.stringify(entries, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="devpocket-export.json"',
    },
  });
}
