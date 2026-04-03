// GET /api/entries  — list entries for the authenticated user (with search/filter)
// POST /api/entries — create a new entry
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { encrypt } from '@/lib/encryption';
import EntryModel from '@/models/Entry';

export async function GET(request: NextRequest) {
  const uid = await verifyToken(request);
  if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const { searchParams } = request.nextUrl;
  const search = searchParams.get('search') ?? '';
  const tag = searchParams.get('tag') ?? '';

  // Build query — always scope to the authenticated user
  const query: Record<string, unknown> = { userId: uid };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  if (tag) {
    query.tags = tag;
  }

  const entries = await EntryModel.find(query)
    .sort({ pinned: -1, updatedAt: -1 })
    .lean();

  // Strip encrypted passwords from list response for security
  const safe = entries.map(({ password: _pw, ...rest }) => rest);

  return Response.json(safe);
}

export async function POST(request: NextRequest) {
  const uid = await verifyToken(request);
  if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();

  const body = await request.json();
  const { title, content, url, password, tags, pinned } = body;

  if (!title)
    return Response.json({ error: 'Title is required' }, { status: 400 });

  const entry = await EntryModel.create({
    userId: uid,
    title,
    content: content ?? '',
    url: url ?? '',
    // Encrypt password if provided
    password: password ? encrypt(password) : '',
    tags: tags ?? [],
    pinned: pinned ?? false,
  });

  return Response.json(entry, { status: 201 });
}
