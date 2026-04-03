// GET    /api/entries/[id] — get single entry (with decrypted password)
// PUT    /api/entries/[id] — update entry
// DELETE /api/entries/[id] — delete entry
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { encrypt, decrypt } from '@/lib/encryption';
import EntryModel from '@/models/Entry';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
  const uid = await verifyToken(request);
  if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { id } = await params;

  const entry = await EntryModel.findOne({ _id: id, userId: uid }).lean();
  if (!entry) return Response.json({ error: 'Not found' }, { status: 404 });

  // Decrypt password for detail view
  const result = {
    ...entry,
    password: entry.password ? decrypt(entry.password) : '',
  };

  return Response.json(result);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const uid = await verifyToken(request);
  if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { id } = await params;

  const body = await request.json();
  const { title, content, url, password, tags, pinned } = body;

  const update: Record<string, unknown> = {
    title,
    content,
    url,
    tags,
    pinned,
    updatedAt: new Date(),
  };

  // Only re-encrypt if a new password was provided
  if (password !== undefined) {
    update.password = password ? encrypt(password) : '';
  }

  const entry = await EntryModel.findOneAndUpdate(
    { _id: id, userId: uid }, // ensure ownership
    { $set: update },
    { new: true },
  ).lean();

  if (!entry) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json(entry);
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const uid = await verifyToken(request);
  if (!uid) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const { id } = await params;

  const result = await EntryModel.deleteOne({ _id: id, userId: uid });
  if (result.deletedCount === 0)
    return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ success: true });
}
