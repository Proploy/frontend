import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function ExpertsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-[200px] px-56">
        <h1 className="headline-main text-text-primary mb-6">Explore Experts</h1>
        <p className="subheading-main text-gray-600 mb-10">
          This is a placeholder for the Explore Experts page.
        </p>
        <Link href="/" className="text-cta-button font-bold hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
