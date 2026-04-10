'use client'

// API Test Page - For testing API endpoints in the browser
import { useState } from 'react'

export default function ApiTestPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [endpoint, setEndpoint] = useState('/api/products?page=1&limit=5')

  const testEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>

      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">API Endpoint:</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="/api/products?page=1&limit=5"
          />
        </div>

        <button
          onClick={testEndpoint}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Endpoint'}
        </button>
      </div>

      {/* Quick Test Buttons */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-2">Quick Tests:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEndpoint('/api/products?page=1&limit=5')
              testEndpoint()
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
          >
            Products
          </button>
          <button
            onClick={() => {
              setEndpoint('/api/companies?page=1&limit=5')
              testEndpoint()
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
          >
            Companies
          </button>
          <button
            onClick={() => {
              setEndpoint('/api/reviews?page=1&limit=5')
              testEndpoint()
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
          >
            Reviews
          </button>
          <button
            onClick={() => {
              setEndpoint('/api/search?q=software&type=all&limit=10')
              testEndpoint()
            }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-semibold">Error:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {results && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-semibold mb-2">Response:</p>
          <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      {/* API Endpoints Reference */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Available Endpoints:</h2>
        <ul className="space-y-1 text-sm">
          <li><code>/api/products</code> - Get products list</li>
          <li><code>/api/products?page=1&limit=20&search=software</code> - Search products</li>
          <li><code>/api/products/[id]</code> - Get single product</li>
          <li><code>/api/companies</code> - Get companies list</li>
          <li><code>/api/companies/[id]</code> - Get single company</li>
          <li><code>/api/reviews</code> - Get reviews list</li>
          <li><code>/api/reviews/product/[productId]</code> - Get reviews by product</li>
          <li><code>/api/search?q=query&type=all</code> - Search all</li>
        </ul>
      </div>
    </div>
  )
}

