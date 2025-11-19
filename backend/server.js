// SAFE ENV LOADING FOR LOCAL (Render issue)
try {
  if (typeof process.loadEnvFile === 'function') {
    try {
      await process.loadEnvFile();
    } catch (err) {
      console.log(
        'No local .env found — using environment variables (Render).'
      );
    }
  }
} catch (err) {
  console.log('Skipping .env loading — Render provides env vars.');
}

import fs from 'fs-extra';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

const dataDir = path.resolve('./data');
await fs.ensureDir(dataDir);

const usersFile = path.join(dataDir, 'users.json');
const dashboardsFile = path.join(dataDir, 'dashboards.json');

await fs.ensureFile(usersFile);
await fs.ensureFile(dashboardsFile);

async function ensureJson(file, defaultValue) {
  try {
    const content = await fs.readFile(file, 'utf8');
    if (!content.trim()) {
      await fs.writeJson(file, defaultValue, { spaces: 2 });
    }
  } catch (err) {
    await fs.writeJson(file, defaultValue, { spaces: 2 });
  }
}

await ensureJson(usersFile, {});
await ensureJson(dashboardsFile, {});

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});
