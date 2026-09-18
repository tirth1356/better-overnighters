import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { MemberProvider } from '@/lib/member';
import { MedicalProvider } from '@/context/MedicalContext';

export default function AppShell() {
  return (
    <MemberProvider>
      <MedicalProvider>
        <div className="app-shell">
          <Sidebar />

          <div className="app-main">
            <TopBar />
            <main className="app-content" id="main-content" role="main">
              <Outlet />
            </main>
          </div>

          <MobileNav />
        </div>
      </MedicalProvider>
    </MemberProvider>
  );
}
