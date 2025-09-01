// Global wheel counters (per-day) using Upstash Redis (Vercel KV-compatible via REST)
// Required env vars:
// - UPSTASH_REDIS_REST_URL
// - UPSTASH_REDIS_REST_TOKEN

// Lightweight in-memory fallback for local development when Upstash vars are missing
const __memory = Object.create(null);

module.exports = async function handler(req, res) {
  // Basic CORS for browser calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const useMemory = !url || !token;

  const date = (req.query.date || '').toString().trim() || todayKey();
  const lossesKey = `wheel_global_losses_${date}`;
  const winsKey = `wheel_global_wins_${date}`;
  const forceKey = `wheel_force_win_token_${date}`;
  const prizeKey = (id) => `wheel_global_prize_${id}_${date}`;
  const monthKey = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1);
    return `${y}-${m}`;
  };
  const monthPrizeKey = (id) => `wheel_month_prize_${id}_${monthKey()}`;
  const MONTHLY_LIMITS = { OFF10: 9 };

  // Deterministic RNG helpers
  function hashString(s){ let h=2166136261>>>0; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=(h*16777619)>>>0;} return h>>>0; }
  function mulberry32(a){ return function(){ let t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15, t|1); t^=t+Math.imul(t^t>>>7, t|61); return ((t^t>>>14)>>>0)/4294967296; } }
  function seededRandom(seed){ const h = hashString(seed||'seed'); const rng = mulberry32(h); return rng(); }

  async function redis(cmd, ...args) {
    if (useMemory) {
      // Minimal subset for GET, SET, INCR, EXPIRE, GETDEL used in this handler
      const [key, val] = args;
      if (cmd === 'GET') return { result: __memory[key] ?? null };
      if (cmd === 'SET') { __memory[key] = val; return { result: 'OK' }; }
      if (cmd === 'INCR') { const n = (parseInt(__memory[key] || '0', 10) || 0) + 1; __memory[key] = String(n); return { result: String(n) } }
      if (cmd === 'EXPIRE') return { result: 1 };
      if (cmd === 'GETDEL') { const v = __memory[key]; delete __memory[key]; return { result: v ?? null } }
      throw new Error(`Memory redis unsupported cmd: ${cmd}`);
    }
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
      const action = (req.query.action || '').toString();
      if (action === 'prizeCounts') {
        // Example: /api/wheel-global?action=prizeCounts&prizes=OFF10,FREE_UPGRADE,FREE_DRINK,BARISTA_CHOICE
        const list = ((req.query.prizes || '') + '').split(',').map(s => s.trim()).filter(Boolean);
        const unique = Array.from(new Set(list));
        const results = await Promise.all(unique.map(id => redis('GET', prizeKey(id))));
        const map = {};
        unique.forEach((id, i) => { map[id] = parseInt(results[i]?.result || '0', 10) || 0; });
        return res.status(200).json({ date, prizes: map });
      }
      if (action === 'monthlyCounts') {
        const list = ((req.query.prizes || '') + '').split(',').map(s => s.trim()).filter(Boolean);
        const unique = Array.from(new Set(list));
        const results = await Promise.all(unique.map(id => redis('GET', monthPrizeKey(id))));
        const map = {};
        unique.forEach((id, i) => {
          const consumed = parseInt(results[i]?.result || '0', 10) || 0;
          const limit = MONTHLY_LIMITS[id] || 0;
          map[id] = { consumed, remaining: Math.max(0, limit - consumed), limit };
        });
        return res.status(200).json({ month: monthKey(), prizes: map });
      }
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
      if (action === 'preSpin') {
        try {
          // Atomically consume a reserved global win token
          const { result: token } = await redis('GETDEL', forceKey);
          const mustWin = !!token;

          // Monthly gating for OFF10 (9 per month randomly paced)
          const off10Limit = MONTHLY_LIMITS.OFF10 || 0;
          let allowOff10 = true;
          if (off10Limit > 0) {
            const { result: consumedRaw } = await redis('GET', monthPrizeKey('OFF10'));
            const consumed = parseInt(consumedRaw || '0', 10) || 0;
            const remaining = Math.max(0, off10Limit - consumed);
            if (remaining <= 0) {
              allowOff10 = false;
            } else {
              // Pace by day: probability scales with remaining coupons over remaining days of this month
              const today = new Date(date);
              const y = today.getFullYear();
              const m = today.getMonth(); // 0-based
              const d = today.getDate();
              // Allowed only on Wed(3), Thu(4), Fri(5)
              const dow = today.getDay();
              const isAllowedDay = (dow === 3 || dow === 4 || dow === 5);
              if (!isAllowedDay) {
                allowOff10 = false;
              } else {
              const daysInMonth = new Date(y, m + 1, 0).getDate();
              const daysRemaining = Math.max(1, daysInMonth - d + 1);
              const ratio = Math.min(1, remaining / daysRemaining);
              const r = seededRandom(`${monthKey()}-${date}-OFF10`);
              allowOff10 = r < ratio;
              }
            }
          }

          return res.status(200).json({ date, mustWin, allowOff10 });
        } catch (e) {
          return res.status(200).json({ date, mustWin: false, allowOff10: true });
        }
      }
      if (action === 'incLoss') {
        const { result } = await redis('INCR', lossesKey);
        // Set a TTL so keys expire after ~7 days to avoid unbounded growth
        await redis('EXPIRE', lossesKey, 7 * 24 * 60 * 60);
        const currentLosses = parseInt(result || '0', 10) || 0;
        // After exactly 10 consecutive losses, reserve a win token for the next spin
        if (currentLosses === 10) {
          await redis('SET', forceKey, 1);
          await redis('EXPIRE', forceKey, 7 * 24 * 60 * 60);
        }
        return res.status(200).json({ date, losses: currentLosses });
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
      if (action === 'prizeWin') {
        const { id } = req.body || {};
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing prize id' });
        const key = prizeKey(id);
        const { result } = await redis('INCR', key);
        await redis('EXPIRE', key, 7 * 24 * 60 * 60);
        // Monthly counter (if limited)
        const mKey = monthPrizeKey(id);
        const consumedRaw = await redis('GET', mKey);
        const consumed = parseInt((consumedRaw && consumedRaw.result) || '0', 10) || 0;
        const limit = MONTHLY_LIMITS[id];
        if (typeof limit === 'number') {
          if (consumed < limit) {
            const { result: mRes } = await redis('INCR', mKey);
            await redis('EXPIRE', mKey, 40 * 24 * 60 * 60);
          }
        }
        return res.status(200).json({ date, id, count: parseInt(result || '0', 10) || 0 });
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


