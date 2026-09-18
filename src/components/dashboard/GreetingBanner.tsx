import { useAuth } from '@/hooks/useAuth';
import { getGreeting } from '@/utils';
import { Sparkles } from 'lucide-react';

export default function GreetingBanner() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const greeting  = getGreeting();

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="greeting-banner">
      <div className="greeting-content">
        <p className="greeting-date">{today}</p>
        <h1 className="greeting-text">
          {greeting}, {firstName} 👋
        </h1>
        <p className="greeting-subtitle">
          Here's your family's health overview for today.
        </p>
      </div>

      <div className="greeting-ai-hint" aria-hidden="true">
        <Sparkles size={16} />
        <span>AI Health Assistant coming soon</span>
      </div>

      <style>{`
        .greeting-banner {
          background: linear-gradient(135deg, var(--color-brown-dark) 0%, var(--color-brown) 60%, var(--color-terra-dark) 100%);
          border-radius: var(--radius-xl);
          padding: 2rem 2.5rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .greeting-banner::before {
          content: '';
          position: absolute;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          top: -60px; right: 60px;
        }

        .greeting-banner::after {
          content: '';
          position: absolute;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          bottom: -40px; right: 20px;
        }

        .greeting-content { position: relative; z-index: 1; }

        .greeting-date {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.55);
          margin-bottom: 0.375rem;
          font-weight: 500;
        }

        .greeting-text {
          font-family: var(--font-serif);
          font-size: 1.875rem;
          font-weight: 600;
          color: white;
          margin: 0 0 0.375rem;
        }

        .greeting-subtitle {
          font-size: 0.9375rem;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }

        .greeting-ai-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-full);
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.75);
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .greeting-banner { flex-direction: column; align-items: flex-start; padding: 1.5rem; }
          .greeting-text { font-size: 1.5rem; }
          .greeting-ai-hint { display: none; }
        }
      `}</style>
    </div>
  );
}
