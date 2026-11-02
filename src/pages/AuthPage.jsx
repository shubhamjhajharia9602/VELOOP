import { useState } from 'react';
import { Zap, Mail, Lock, UserRound, ArrowRight } from 'lucide-react';
import { apiRequest } from '../services/api';
import styles from './AuthPage.module.css';

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === 'login' ? '/auth/login' : '/auth/signup';

      const payload =
        mode === 'login'
          ? { email: email.trim(), password }
          : { name: name.trim(), email: email.trim(), password };

      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const token = data.token || data.accessToken;
      const user = data.user || null;

      if (!token || !user) {
        throw new Error('Invalid response from server. Please try again.');
      }

      localStorage.setItem('velopToken', token);
      localStorage.setItem('velopUser', JSON.stringify(user));

      onLogin?.(user);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <main className={styles.authPage}>
      <div className={styles.backgroundGlow} />

      <section className={styles.authCard}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <Zap size={25} fill="currentColor" />
          </div>
          <h1>VELOOP</h1>
          <p className={styles.brandTagline}>LEVEL UP YOUR JOURNEY</p>
        </div>

        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            {mode === 'login' ? 'WELCOME BACK' : 'JOIN THE COMMUNITY'}
          </span>

          <h2>
            {mode === 'login' ? (
              <>Ready to <span>level up?</span></>
            ) : (
              <>Start your <span>journey.</span></>
            )}
          </h2>

          <p>
            {mode === 'login'
              ? 'Sign in to continue your VELOOP journey.'
              : 'Create an account and start earning XP.'}
          </p>
        </div>

        <div className={styles.modeSwitch}>
          <button
            type="button"
            className={mode === 'login' ? styles.modeActive : ''}
            onClick={() => changeMode('login')}
          >
            Sign In
          </button>

          <button
            type="button"
            className={mode === 'register' ? styles.modeActive : ''}
            onClick={() => changeMode('register')}
          >
            Create Account
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label htmlFor="name">Full Name</label>
              <div className={styles.inputWrapper}>
                <UserRound size={18} />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} />
              <input
                id="password"
                type="password"
                placeholder={
                  mode === 'register'
                    ? 'At least 8 characters'
                    : 'Enter your password'
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                minLength={mode === 'register' ? 8 : 1}
                required
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            <span>
              {loading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className={styles.switchText}>
          {mode === 'login'
            ? "Don't have an account?"
            : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() =>
              changeMode(mode === 'login' ? 'register' : 'login')
            }
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <div className={styles.bottomNote}>
          <Zap size={14} />
          <span>Your progress. Your rewards. Your journey.</span>
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
