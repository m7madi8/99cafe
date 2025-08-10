// Global wheel counters (per-day) using Upstash Redis (Vercel KV-compatible via REST)
// Required env vars:
// - UPSTASH_REDIS_REST_URL
// - UPSTASH_REDIS_REST_TOKEN

module.exports = async function handler(req, res) {
  // Basic CORS for browser calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return res.status(500).json({ error: 'Upstash env vars missing' });
  }

  const date = (req.query.date || '').toString().trim() || todayKey();
  const lossesKey = `wheel_global_losses_${date}`;
  const winsKey = `wheel_global_wins_${date}`;

  async function redis(cmd, ...args) {
    const body = { command: [cmd, ...args] };
    const r = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`Upstash error: ${r.status}`);
    return r.json();
  }

  try {
    if (req.method === 'GET') {
      const [{ result: lossesRaw }, { result: winsRaw }] = await Promise.all([
        redis('GET', lossesKey),
        redis('GET', winsKey),
      ]);
      const losses = parseInt(lossesRaw || '0', 10) || 0;
      const wins = parseInt(winsRaw || '0', 10) || 0;
      return res.status(200).json({ date, losses, wins });
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};
      if (action === 'incLoss') {
        const { result } = await redis('INCR', lossesKey);
        // Set a TTL so keys expire after ~7 days to avoid unbounded growth
        await redis('EXPIRE', lossesKey, 7 * 24 * 60 * 60);
        return res.status(200).json({ date, losses: parseInt(result || '0', 10) || 0 });
      }
      if (action === 'win') {
        // Increment wins and reset losses for the day
        await Promise.all([
          redis('INCR', winsKey),
          redis('SET', lossesKey, 0),
          redis('EXPIRE', winsKey, 7 * 24 * 60 * 60),
          redis('EXPIRE', lossesKey, 7 * 24 * 60 * 60),
        ]);
        return res.status(200).json({ date, ok: true });
      }
      return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}


