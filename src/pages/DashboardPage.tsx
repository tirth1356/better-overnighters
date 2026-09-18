import GreetingBanner from '@/components/dashboard/GreetingBanner';
import OverviewCards from '@/components/dashboard/OverviewCards';
import FamilyHealthSummary from '@/components/dashboard/FamilyHealthSummary';
import RecentRecords from '@/components/dashboard/RecentRecords';
import UpcomingAppointments from '@/components/dashboard/UpcomingAppointments';
import QuickActions from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  return (
    <div className="dashboard animate-fade-up">
      <GreetingBanner />

      <OverviewCards />

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Left column */}
        <div className="dashboard-col-main">
          <FamilyHealthSummary />
          <div style={{ marginTop: '1.25rem' }}>
            <RecentRecords />
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard-col-side">
          <UpcomingAppointments />
          <div style={{ marginTop: '1.25rem' }}>
            <QuickActions />
          </div>
        </div>
      </div>

      <style>{`
        .dashboard {
          max-width: 1200px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.25rem;
          align-items: start;
        }

        .dashboard-col-main,
        .dashboard-col-side {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
