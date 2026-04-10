import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FD] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-12 shadow-sm border border-blue-50">
        <div className="flex justify-center mb-8">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#011127] mb-4 font-dm-sans">Application Submitted!</h1>
        <p className="text-gray-600 mb-10 leading-relaxed">
          Thank you for applying to join Proploy. Our team will review your application and get back to you within 3-5 business days.
        </p>
        <Link 
          href="/" 
          className="inline-block w-full py-4 bg-[#0466E7] text-white rounded-full font-bold hover:bg-[#0355c0] transition-all shadow-lg shadow-blue-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
