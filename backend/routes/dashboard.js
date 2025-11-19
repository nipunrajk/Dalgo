import express from 'express';
import { readDashboards, writeDashboards } from '../utils/storage.js';
import { verifyToken } from '../utils/jwt.js';

const router = express.Router();

// GET /dashboard
router.get('/', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'not authenticated' });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'invalid token' });

    const dashboards = await readDashboards();
    const userDash = dashboards[payload.id] ?? { widgets: [] };
    return res.json({ dashboard: userDash });
  } catch (err) {
    console.error('GET /dashboard err', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// POST /dashboard
router.post('/', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'not authenticated' });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'invalid token' });

    const body = req.body || {};
    if (!body.dashboard || typeof body.dashboard !== 'object') {
      return res.status(400).json({ error: 'dashboard payload required' });
    }

    const dashboards = await readDashboards();
    dashboards[payload.id] = body.dashboard;
    await writeDashboards(dashboards);

    return res.json({ ok: true });
  } catch (err) {
    console.error('POST /dashboard err', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

export default router;
