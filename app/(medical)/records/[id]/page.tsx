'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useMedical } from '@/context/MedicalContext'
import { RecordDetailView } from '@/components/records/RecordDetailView'
import { Button } from '@/components/ui/Button'

export default function RecordDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { records, getRecordById, getFamilyMemberById, getDoctorById } = useMedical()

  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const record = getRecordById(id as string)

  if (!record) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#FAEAEA] text-[#8B2020] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif text-espresso">Record Not Found</h2>
        <p className="text-xs text-brown-600">
          We couldn’t find a medical record with the identifier <span className="font-mono">{id}</span>. It may have been archived or removed.
        </p>
        <div className="pt-2">
          <Link href="/records">
            <Button variant="primary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Medical Vault
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const member = getFamilyMemberById(record.familyMemberId)
  const doctor = record.doctorId ? getDoctorById(record.doctorId) : undefined

  return <RecordDetailView record={record} member={member} doctor={doctor} />
}
