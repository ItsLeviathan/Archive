/**
 * Small in-memory, per-key sliding-window rate limiter.
 *
 * This lives in server process memory, so on a multi-instance / serverless
 * deploy each instance enforces its own independent limit rather than one
 * shared global counter. That's an acceptable trade-off for a soft
 * anti-spam guard: it still meaningfully throttles one client hammering a
 * single instance, and it needs zero extra infrastructure. If you later
 * need a hard, globally-consistent limit, swap this for Redis / Upstash /
 * a Postgres-backed counter — the call sites below won't need to change.
 */

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export function clientKey(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
}