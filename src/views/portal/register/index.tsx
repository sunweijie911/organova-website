'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import styles from './index.module.scss';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterView() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(form.email)) {
      setError('Please enter a valid email');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.name,
      });
      if (result.error) {
        setError(result.error.message ?? 'Registration failed');
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link className={styles.logo} href="/">
          OrgaNova TRiCBiO
        </Link>
        <h1 className={styles.title}>Create Account</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            onChange={set('name')}
            placeholder="Full Name"
            required
            type="text"
            value={form.name}
          />
          <input
            autoComplete="email"
            className={styles.input}
            onChange={set('email')}
            placeholder="Email Address"
            required
            type="email"
            value={form.email}
          />
          <input
            className={styles.input}
            onChange={set('company')}
            placeholder="Company (optional)"
            type="text"
            value={form.company}
          />
          <input
            autoComplete="new-password"
            className={styles.input}
            onChange={set('password')}
            placeholder="Password (min 8 characters)"
            required
            type="password"
            value={form.password}
          />
          <button className={styles.btn} disabled={loading} type="submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
