import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { readUsers, writeUsers } from '../utils/storage.js';
import { signToken, verifyToken } from '../utils/jwt.js';

const router = express.Router();

// cookie options - update for production (secure:true, sameSite:'none' for cross-site)
const isProd = process.env.NODE_ENV === 'production';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'none',
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

function getTokenFromReq(req) {
  return req.cookies && req.cookies.token;
}

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'name, email and password are required' });
    }

    const emailLower = String(email).toLowerCase().trim();
    const users = await readUsers();
    const existing = users.find((user) => user.email === emailLower);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // bcrypt.hash (async)
    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      name: String(name).trim(),
      email: emailLower,
      password: hashed,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    const token = signToken({ id: newUser.id, email: newUser.email });
    res.cookie('token', token, COOKIE_OPTS);

    const { password: _p, ...safeUser } = newUser;
    return res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error('register err', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const emailLower = String(email).toLowerCase().trim();
    const users = await readUsers();
    const user = users.find((user) => user.email === emailLower);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: 'invalid credentials' });

    const token = signToken({ id: user.id, email: user.email });
    res.cookie('token', token, COOKIE_OPTS);
    const { password: _p, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    console.error('login err', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', { path: '/' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('logout err', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// GET /auth/me
router.get('/me', async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ error: 'not authenticated' });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'invalid token' });

    const users = await readUsers();
    const user = users.find((u) => u.id === payload.id);
    if (!user) return res.status(401).json({ error: 'user not found' });

    const { password: _p, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    console.error('me err', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

export default router;
