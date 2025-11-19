'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) newErrors.confirm = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setUser(res.user || null);
      router.push('/dashboard');
    } catch (err: any) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className='max-w-md mx-auto mt-12 bg-white p-6 rounded shadow'>
      <h2 className='text-2xl font-semibold'>Create an account</h2>
      <form className='mt-4 space-y-4' onSubmit={onSubmit} noValidate>
        {errors.form && <p className='text-red-600'>{errors.form}</p>}
        <div>
          <label className='block text-sm font-medium'>Full name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className='mt-1 w-full border px-3 py-2 rounded'
            required
          />
          {errors.name && (
            <p className='text-red-600 text-sm mt-1'>{errors.name}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium'>Email</label>
          <input
            type='email'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className='mt-1 w-full border px-3 py-2 rounded'
            required
          />
          {errors.email && (
            <p className='text-red-600 text-sm mt-1'>{errors.email}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium'>Password</label>
          <input
            type='password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className='mt-1 w-full border px-3 py-2 rounded'
            required
          />
          {errors.password && (
            <p className='text-red-600 text-sm mt-1'>{errors.password}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium'>Confirm password</label>
          <input
            type='password'
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className='mt-1 w-full border px-3 py-2 rounded'
            required
          />
          {errors.confirm && (
            <p className='text-red-600 text-sm mt-1'>{errors.confirm}</p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <button
            type='submit'
            className='px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-60'
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create account'}
          </button>
          <a href='/login' className='text-sm text-slate-600'>
            Already have an account?
          </a>
        </div>
      </form>
    </div>
  );
}
