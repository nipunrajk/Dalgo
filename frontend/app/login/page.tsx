'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FormState = { email: string; password: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors: Partial<FormState> = {};

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(form.email))
      newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      // Placeholder: replace with actual backend call
      console.log('would send login payload:', form);
      // simulate success
      setTimeout(() => {
        setSubmitting(false);
        router.push('/dashboard');
      }, 600);
    } catch (err) {
      setSubmitting(false);
      setErrors({ password: 'Login failed — check credentials' });
    }
  }

  return (
    <div className='max-w-md mx-auto mt-12 bg-white p-6 rounded shadow'>
      <h2 className='text-2xl font-semibold'>Login</h2>
      <form className='mt-4 space-y-4' onSubmit={onSubmit} noValidate>
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

        <div className='flex items-center justify-between'>
          <button
            type='submit'
            className='px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-60'
            disabled={submitting}
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
          <a href='/register' className='text-sm text-slate-600'>
            Create account
          </a>
        </div>
      </form>
    </div>
  );
}
