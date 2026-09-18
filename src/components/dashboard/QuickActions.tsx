import { useNavigate } from 'react-router-dom';
import { Upload, Pill, UserPlus, Stethoscope } from 'lucide-react';

interface QuickAction {
  id:      string;
  label:   string;
  icon:    React.ComponentType<{ size?: number; strokeWidth?: number }>;
  color:   string;
  bg:      string;
  border:  string;
  route:   string;
}

const ACTIONS: QuickAction[] = [
  {
    id:     'qa-upload-report',
    label:  'Upload Report',
    icon:   Upload,
    color:  'var(--color-sage-dark)',
    bg:     'rgba(124,146,116,0.1)',
    border: 'rgba(124,146,116,0.25)',
    route:  '/medical-records',
  },
  {
    id:     'qa-add-medicine',
    label:  'Add Medicine',
    icon:   Pill,
    color:  'var(--color-terra)',
    bg:     'rgba(184,111,82,0.1)',
    border: 'rgba(184,111,82,0.25)',
    route:  '/medicines',
  },
  {
    id:     'qa-add-member',
    label:  'Add Member',
    icon:   UserPlus,
    color:  'var(--color-brown)',
    bg:     'var(--color-cream)',
    border: 'var(--color-border-dark)',
    route:  '/family',
  },
  {
    id:     'qa-add-doctor',
    label:  'Add Doctor',
    icon:   Stethoscope,
    color:  '#5A8AC8',
    bg:     'rgba(90,138,200,0.1)',
    border: 'rgba(90,138,200,0.25)',
    route:  '/doctors',
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="qa-section">
      <h2 className="section-title">Quick Actions</h2>
      <div className="qa-grid">
        {ACTIONS.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={action.id}
              className="qa-btn"
              onClick={() => navigate(action.route)}
              style={{
                borderColor: action.border,
                background: action.bg,
              }}
              aria-label={action.label}
            >
              <div className="qa-icon" style={{ color: action.color }}>
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <span className="qa-label" style={{ color: action.color }}>{action.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .qa-section { margin-top: 0.5rem; }
        .qa-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.875rem;
        }
        .qa-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.625rem;
          padding: 1.25rem 0.75rem;
          border-radius: var(--radius-lg);
          border: 1.5px solid;
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }
        .qa-btn:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          filter: brightness(0.97);
        }
        .qa-icon { display: flex; align-items: center; justify-content: center; }
        .qa-label { font-size: 0.8125rem; font-weight: 600; text-align: center; line-height: 1.2; }
        @media (max-width: 640px) { .qa-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </div>
  );
}
