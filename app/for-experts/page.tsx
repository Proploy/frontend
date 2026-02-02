import Link from 'next/link'

export default function ForExpertsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-[120px] px-56">
        <h1 className="headline-main text-text-primary mb-6">For Experts</h1>
        <p className="subheading-main text-gray-600 mb-10">
          This is a placeholder for the For Experts page.
        </p>
        <Link href="/" className="text-cta-button font-bold hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
