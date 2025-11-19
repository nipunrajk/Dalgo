import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  readUsers,
  writeUsers,
  readDashboards,
  writeDashboards,
} from '../utils/storage.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDataDir = path.resolve(__dirname, '..', 'data');

describe('Storage Utils', () => {
  beforeEach(async () => {
    await fs.ensureDir(testDataDir);
  });

  it('should read users from file', async () => {
    const users = await readUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  it('should write and read users', async () => {
    const testUsers = [
      { id: '1', name: 'Test User', email: 'test@example.com' },
    ];

    await writeUsers(testUsers);
    const users = await readUsers();

    expect(users).toEqual(testUsers);
  });

  it('should read dashboards from file', async () => {
    const dashboards = await readDashboards();
    expect(typeof dashboards).toBe('object');
  });

  it('should write and read dashboards', async () => {
    const testDashboards = {
      user1: { widgets: [] },
    };

    await writeDashboards(testDashboards);
    const dashboards = await readDashboards();

    expect(dashboards).toEqual(testDashboards);
  });
});
