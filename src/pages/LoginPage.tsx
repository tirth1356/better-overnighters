import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]         = useState('tirth@familycare.app');
  const [password, setPassword]   = useState('password123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors]       = useState<FormErrors>({});

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const result = await login(email, password, rememberMe);

    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrors({ general: result.error ?? 'Login failed. Please try again.' });
    }
  }

  return (
    <div className="auth-page">
      {/* Left panel — decorative */}
      <aside className="auth-panel">
        <div className="auth-panel-inner">
          <div className="auth-brand">
            <Logo size={48} />
            <h1 className="auth-brand-name">FamilyCare</h1>
            <p className="auth-brand-tagline">Your family's health, all in one place.</p>
          </div>

          <div className="auth-testimonial">
            <Heart size={20} style={{ color: 'var(--color-terra-light)' }} />
            <blockquote>
              "Managing my parents' medicines and doctor visits used to be chaotic.
              FamilyCare gave us clarity."
            </blockquote>
            <cite>— Riya M., Bengaluru</cite>
          </div>

          <div className="auth-features">
            {[
              'Manage all family members',
              'Track medicines & records',
              'Emergency health cards',
              'AI in Hindi, English & Gujarati',
            ].map(feat => (
              <div key={feat} className="auth-feature-item">
                <span className="auth-feature-dot" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Right panel — form */}
      <main className="auth-form-panel">
        <div className="auth-form-container animate-fade-up">
          {/* Mobile logo */}
          <div className="auth-mobile-brand">
            <Logo size={36} />
            <span className="auth-mobile-brand-name">FamilyCare</span>
          </div>

          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your family health space</p>
          </div>

          {/* Demo hint */}
          <div className="auth-demo-hint">
            <AlertCircle size={14} />
            <span>Demo: <strong>tirth@familycare.app</strong> / <strong>password123</strong></span>
          </div>

          {errors.general && (
            <div className="auth-error-banner">
              <AlertCircle size={15} />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="login-email" className="input-label">Email address</label>
              <input
                id="login-email"
                type="email"
                className={`input-field ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                disabled={isLoading}
              />
              {errors.email && <p className="input-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="form-group-row">
                <label htmlFor="login-password" className="input-label">Password</label>
                <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
              </div>
              <div className="input-icon-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="input-error">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <label className="auth-remember">
              <input
                id="login-remember"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="spin-icon" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="auth-switch">
            New to FamilyCare?{' '}
            <Link to="/signup" id="go-to-signup">Create an account</Link>
          </p>
        </div>
      </main>

      <style>{authStyles}</style>
    </div>
  );
}

const authStyles = `
  .auth-page {
    min-height: 100dvh;
    display: flex;
  }

  /* Left decorative panel */
  .auth-panel {
    width: 420px;
    flex-shrink: 0;
    background: linear-gradient(160deg, var(--color-brown-dark) 0%, var(--color-brown) 50%, var(--color-terra-dark) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .auth-panel::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    top: -80px;
    right: -80px;
  }

  .auth-panel::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
    bottom: -50px;
    left: -50px;
  }

  .auth-panel-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .auth-brand {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .auth-brand-name {
    font-family: var(--font-serif);
    font-size: 2rem;
    font-weight: 600;
    color: white;
    margin: 0;
  }

  .auth-brand-tagline {
    font-size: 1rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.5;
  }

  .auth-testimonial {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .auth-testimonial blockquote {
    font-size: 0.9375rem;
    color: rgba(255,255,255,0.85);
    line-height: 1.6;
    font-style: italic;
  }

  .auth-testimonial cite {
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.5);
    font-style: normal;
  }

  .auth-features {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .auth-feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9375rem;
    color: rgba(255,255,255,0.8);
  }

  .auth-feature-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-terra-light);
    flex-shrink: 0;
  }

  /* Right form panel */
  .auth-form-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--color-bg);
  }

  .auth-form-container {
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .auth-mobile-brand {
    display: none;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .auth-mobile-brand-name {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-brown);
  }

  .auth-form-header h2 {
    font-size: 1.875rem;
    color: var(--color-text);
    margin-bottom: 0.25rem;
  }

  .auth-form-header p {
    font-size: 0.9375rem;
    color: var(--color-text-muted);
  }

  .auth-demo-hint {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(124,146,116,0.12);
    border: 1px solid rgba(124,146,116,0.25);
    border-radius: var(--radius-md);
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    color: var(--color-sage-dark);
  }

  .auth-error-banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(200,90,90,0.08);
    border: 1px solid rgba(200,90,90,0.2);
    border-radius: var(--radius-md);
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    color: #C85A5A;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .form-group-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .auth-forgot-link {
    font-size: 0.875rem;
    color: var(--color-terra);
    font-weight: 500;
  }

  .auth-forgot-link:hover {
    color: var(--color-terra-dark);
  }

  .input-icon-wrapper {
    position: relative;
  }

  .input-icon-wrapper .input-field {
    padding-right: 2.75rem;
  }

  .input-icon-btn {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    transition: color var(--transition-fast);
  }

  .input-icon-btn:hover {
    color: var(--color-text);
  }

  .auth-remember {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
    cursor: pointer;
  }

  .auth-remember input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--color-terra);
    cursor: pointer;
  }

  .auth-submit-btn {
    width: 100%;
    margin-top: 0.25rem;
  }

  .auth-switch {
    text-align: center;
    font-size: 0.9375rem;
    color: var(--color-text-muted);
  }

  .auth-switch a {
    color: var(--color-terra);
    font-weight: 600;
  }

  .auth-switch a:hover {
    color: var(--color-terra-dark);
  }

  .spin-icon {
    animation: spin 0.7s linear infinite;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .auth-panel { display: none; }
    .auth-mobile-brand { display: flex; }
  }
`;
