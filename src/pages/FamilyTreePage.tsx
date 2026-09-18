import { GitFork, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import FamilyTree from '@/components/family/FamilyTree';

export default function FamilyTreePage() {
  return (
    <div className="family-tree-page animate-fade-up">
      {/* Page header */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="page-header-eyebrow">
            <GitFork size={16} />
            <span>Patel Family</span>
          </div>
          <h1 className="page-title">Family Tree</h1>
          <p className="page-subtitle">
            Click any family member to view their health profile
          </p>
        </div>
        <Link
          to="/family"
          className="btn btn-outline btn-md"
          id="go-to-family-list-btn"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Users size={15} />
          Manage Members
        </Link>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <FamilyTree />
      </div>

      <style>{`
        .family-tree-page { max-width: 1200px; }
        .page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
        .page-header-eyebrow { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8125rem; font-weight: 600; color: var(--color-terra); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.375rem; }
        .page-title { font-family: var(--font-serif); font-size: 2rem; color: var(--color-text); margin: 0; }
        .page-subtitle { font-size: 0.9375rem; color: var(--color-text-muted); margin-top: 0.25rem; }
      `}</style>
    </div>
  );
}
