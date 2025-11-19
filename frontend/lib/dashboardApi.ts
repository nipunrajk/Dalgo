import client from './api';

// GET /dashboard
export async function fetchDashboard() {
  const res = await client.get('/dashboard');
  return res.data.dashboard;
}

// POST /dashboard
export async function saveDashboard(dashboard: any) {
  const res = await client.post('/dashboard', { dashboard });
  return res.data;
}
