import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from '@/components/ui/Logo';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: '', color: 'transparent', width: '0%' };
  if (pw.length < 6) return { label: 'Too short', color: '#C85A5A', width: '20%' };
  if (pw.length < 8) return { label: 'Weak', color: '#E5913A', width: '40%' };
  if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw))
    return { label: 'Fair', color: '#E5C33A', width: '60%' };
  if (pw.length >= 10 && /[^a-zA-Z0-9]/.test(pw))
    return { label: 'Strong', color: '#5AAF7A', width: '100%' };
  return { label: 'Good', color: '#7C9274', width: '80%' };
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [errors, setErrors]               = useState<FormErrors>({});
  const [success, setSuccess]             = useState(false);

  const pwStrength = getPasswordStrength(password);

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const result = await signup(name.trim(), email, password);
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      // Short success animation before redirecting to dashboard
      setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
    } else {
      setErrors({ general: result.error ?? 'Could not create account. Please try again.' });
    }
  }

  return (
    <div className="auth-page">
      {/* Left panel */}
      <aside className="auth-panel signup-panel">
        <div className="auth-panel-inner">
          <div className="auth-brand">
            <Logo size={48} />
            <h1 className="auth-brand-name">FamilyCare</h1>
            <p className="auth-brand-tagline">
              Start your family's health journey today.
            </p>
          </div>

          <div className="signup-steps">
            <p className="signup-steps-title">What happens next?</p>
            {[
              { num: '1', text: 'Create your account' },
              { num: '2', text: 'Set up your family' },
              { num: '3', text: 'Add family members' },
              { num: '4', text: 'Start tracking health' },
            ].map(step => (
              <div key={step.num} className="signup-step">
                <span className="signup-step-num">{step.num}</span>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="auth-form-panel">
        <div className="auth-form-container animate-fade-up">
          {/* Mobile logo */}
          <div className="auth-mobile-brand">
            <Logo size={36} />
            <span className="auth-mobile-brand-name">FamilyCare</span>
          </div>

          {success ? (
            <div className="signup-success">
              <CheckCircle2 size={56} style={{ color: 'var(--color-sage)' }} />
              <h2>Account created!</h2>
              <p>Welcome to FamilyCare. Setting up your space…</p>
            </div>
          ) : (
            <>
              <div className="auth-form-header">
                <h2>Create your account</h2>
                <p>Join thousands of families managing health together</p>
              </div>

              {errors.general && (
                <div className="auth-error-banner">
                  <AlertCircle size={15} />
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                {/* Full name */}
                <div className="form-group">
                  <label htmlFor="signup-name" className="input-label">Full name</label>
                  <input
                    id="signup-name"
                    type="text"
                    className={`input-field ${errors.name ? 'error' : ''}`}
                    placeholder="Tirth Patel"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                    disabled={isLoading}
                  />
                  {errors.name && <p className="input-error">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="signup-email" className="input-label">Email address</label>
                  <input
                    id="signup-email"
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
                  <label htmlFor="signup-password" className="input-label">Password</label>
                  <div className="input-icon-wrapper">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      className={`input-field ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
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
                  {/* Strength bar */}
                  {password && (
                    <div className="pw-strength">
                      <div className="pw-strength-bar">
                        <div
                          className="pw-strength-fill"
                          style={{ width: pwStrength.width, background: pwStrength.color }}
                        />
                      </div>
                      <span className="pw-strength-label" style={{ color: pwStrength.color }}>
                        {pwStrength.label}
                      </span>
                    </div>
                  )}
                  {errors.password && <p className="input-error">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div className="form-group">
                  <label htmlFor="signup-confirm" className="input-label">Confirm password</label>
                  <div className="input-icon-wrapper">
                    <input
                      id="signup-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="input-icon-btn"
                      onClick={() => setShowConfirm(p => !p)}
                      aria-label={showConfirm ? 'Hide' : 'Show'}
                    >
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="input-error">{errors.confirmPassword}</p>}
                </div>

                <button
                  id="signup-submit"
                  type="submit"
                  className="btn btn-primary btn-lg auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="spin-icon" />
                      Creating account…
                    </>
                  ) : (
                    'Create account & set up family →'
                  )}
                </button>

                <p className="auth-terms">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>

              <p className="auth-switch">
                Already have an account?{' '}
                <Link to="/login" id="go-to-login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </main>

      <style>{signupExtraStyles}</style>
    </div>
  );
}

const signupExtraStyles = `
  /* Reuse auth-page base styles from LoginPage */
  .auth-page {
    min-height: 100dvh;
    display: flex;
  }

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
    width: 300px; height: 300px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    top: -80px; right: -80px;
  }

  .auth-panel-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .auth-brand { display: flex; flex-direction: column; gap: 0.75rem; }
  .auth-brand-name { font-family: var(--font-serif); font-size: 2rem; font-weight: 600; color: white; margin: 0; }
  .auth-brand-tagline { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.5; }

  .signup-steps { display: flex; flex-direction: column; gap: 1rem; }
  .signup-steps-title { font-size: 0.875rem; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.06em; }
  .signup-step {
    display: flex; align-items: center; gap: 1rem;
    font-size: 0.9375rem; color: rgba(255,255,255,0.85);
  }
  .signup-step-num {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8125rem; font-weight: 700; color: white;
    flex-shrink: 0;
  }

  .auth-form-panel {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
    background: var(--color-bg);
  }

  .auth-form-container {
    width: 100%; max-width: 440px;
    display: flex; flex-direction: column; gap: 1.5rem;
  }

  .auth-mobile-brand { display: none; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
  .auth-mobile-brand-name { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 600; color: var(--color-brown); }

  .auth-form-header h2 { font-size: 1.875rem; color: var(--color-text); margin-bottom: 0.25rem; }
  .auth-form-header p { font-size: 0.9375rem; color: var(--color-text-muted); }

  .auth-error-banner {
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(200,90,90,0.08); border: 1px solid rgba(200,90,90,0.2);
    border-radius: var(--radius-md); padding: 0.75rem 1rem;
    font-size: 0.9rem; color: #C85A5A;
  }

  .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.375rem; }

  .input-icon-wrapper { position: relative; }
  .input-icon-wrapper .input-field { padding-right: 2.75rem; }
  .input-icon-btn {
    position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
    background: none; border: none; color: var(--color-text-muted);
    cursor: pointer; padding: 0.25rem; display: flex; align-items: center;
    transition: color var(--transition-fast);
  }
  .input-icon-btn:hover { color: var(--color-text); }

  .pw-strength { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.375rem; }
  .pw-strength-bar {
    flex: 1; height: 4px; background: var(--color-border); border-radius: 2px; overflow: hidden;
  }
  .pw-strength-fill {
    height: 100%; border-radius: 2px;
    transition: width 0.3s ease, background 0.3s ease;
  }
  .pw-strength-label { font-size: 0.8125rem; font-weight: 600; white-space: nowrap; }

  .auth-submit-btn { width: 100%; margin-top: 0.25rem; }

  .auth-terms { font-size: 0.8125rem; color: var(--color-text-light); text-align: center; line-height: 1.5; }

  .auth-switch { text-align: center; font-size: 0.9375rem; color: var(--color-text-muted); }
  .auth-switch a { color: var(--color-terra); font-weight: 600; }
  .auth-switch a:hover { color: var(--color-terra-dark); }

  .signup-success {
    display: flex; flex-direction: column; align-items: center;
    gap: 1rem; text-align: center; padding: 3rem 0;
  }
  .signup-success h2 { font-size: 1.75rem; color: var(--color-text); }
  .signup-success p { color: var(--color-text-muted); }

  .spin-icon { animation: spin 0.7s linear infinite; }

  @media (max-width: 768px) {
    .auth-panel { display: none; }
    .auth-mobile-brand { display: flex; }
  }
`;
