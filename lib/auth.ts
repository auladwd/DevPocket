// Server-side Firebase ID token verification
// Uses jsonwebtoken + Firebase's public X.509 certs (no Admin SDK needed)
import jwt from 'jsonwebtoken';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;
const CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

// In-memory cert cache keyed by kid
let certCache: { certs: Record<string, string>; expiresAt: number } | null =
  null;

async function getPublicCert(kid: string): Promise<string | null> {
  const now = Date.now();

  if (!certCache || certCache.expiresAt <= now) {
    const res = await fetch(CERTS_URL);
    if (!res.ok) return null;

    const cc = res.headers.get('cache-control') ?? '';
    const maxAgeMatch = cc.match(/max-age=(\d+)/);
    const ttl = maxAgeMatch ? parseInt(maxAgeMatch[1]) * 1000 : 3_600_000;

    certCache = {
      certs: (await res.json()) as Record<string, string>,
      expiresAt: now + ttl,
    };
  }

  return certCache.certs[kid] ?? null;
}

export async function verifyToken(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const idToken = authHeader.slice(7);

  try {
    // Decode header without verifying to get the key id (kid)
    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded || typeof decoded === 'string') return null;

    const kid = decoded.header.kid;
    if (!kid) return null;

    // Fetch the matching public cert from Google
    const cert = await getPublicCert(kid);
    if (!cert) return null;

    // Verify signature + standard claims
    const payload = jwt.verify(idToken, cert, {
      algorithms: ['RS256'],
      audience: FIREBASE_PROJECT_ID,
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    }) as jwt.JwtPayload;

    // sub is the Firebase UID
    if (!payload.sub) return null;
    return payload.sub;
  } catch {
    // jwt.verify throws on invalid/expired tokens
    return null;
  }
}
