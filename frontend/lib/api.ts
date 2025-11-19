import axios, { AxiosError } from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const client = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function handleAxiosError(err: unknown) {
  if (!err) throw new Error('Unknown error');
  const e = err as AxiosError;
  if (e.response && e.response.data) {
    const payload = e.response.data as any;
    const message =
      payload.error || payload.message || e.message || 'Request failed';
    const error = new Error(message);
    (error as any).status = e.response.status;
    (error as any).payload = payload;
    throw error;
  }
  throw new Error(e.message || 'Network error');
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const res = await client.post('/auth/register', payload);
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function loginUser(payload: { email: string; password: string }) {
  try {
    const res = await client.post('/auth/login', payload);
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function logoutUser() {
  try {
    const res = await client.post('/auth/logout');
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export async function getCurrentUser() {
  try {
    const res = await client.get('/auth/me');
    return res.data;
  } catch (err) {
    handleAxiosError(err);
  }
}

export default client;
