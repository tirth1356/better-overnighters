import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { useMedical } from '@/context/MedicalContext';
import { RecordDetailView } from './RecordDetailView';

export default function RecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getRecordById, getFamilyMemberById, getDoctorById } = useMedical();

  const record = id ? getRecordById(id) : undefined;
  const member = record ? getFamilyMemberById(record.familyMemberId) : undefined;
  const doctor = record?.doctorId ? getDoctorById(record.doctorId) : undefined;

  if (!record) {
    return (
      <div className="card flex flex-col items-center justify-center py-20 text-center max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-beige-100 flex items-center justify-center mb-4 text-terra">
          <FileQuestion size={32} />
        </div>
        <h2 className="text-xl font-serif text-espresso mb-2">Record Not Found</h2>
        <p className="text-warm-muted text-sm mb-6">
          The medical record you are trying to view does not exist or has been removed from your vault.
        </p>
        <Link to="/medical-records" className="btn btn-primary btn-md" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={16} className="mr-1" />
          Back to Vault
        </Link>
      </div>
    );
  }

  return <RecordDetailView record={record} member={member} doctor={doctor} />;
}
