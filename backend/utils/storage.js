import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', 'data');
const usersFile = path.join(dataDir, 'users.json');
const dashboardsFile = path.join(dataDir, 'dashboards.json');

async function ensureDataFiles() {
  await fs.ensureDir(dataDir);
  if (!(await fs.pathExists(usersFile))) {
    await fs.writeJson(usersFile, [], { spaces: 2 });
  }
  if (!(await fs.pathExists(dashboardsFile))) {
    await fs.writeJson(dashboardsFile, {}, { spaces: 2 });
  }
}

export async function readUsers() {
  await ensureDataFiles();
  return fs.readJson(usersFile);
}

export async function writeUsers(users) {
  await ensureDataFiles();
  return fs.writeJson(usersFile, users, { spaces: 2 });
}

export async function readDashboards() {
  await ensureDataFiles();
  return fs.readJson(dashboardsFile);
}

export async function writeDashboards(payload) {
  await ensureDataFiles();
  return fs.writeJson(dashboardsFile, payload, { spaces: 2 });
}
