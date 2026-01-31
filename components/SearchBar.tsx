'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Product {
  product_id: string
  product_name: string
  product_logo: string | null
  product_description?: string
}

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)

  // Handle Search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`)
          const data = await res.json()
          if (data && data.data) {
            setSearchResults(data.data)
            setIsDropdownOpen(true)
          }
        } catch (err) {
          console.error('Search failed:', err)
        }
      } else {
        setSearchResults([])
        setIsDropdownOpen(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchBarRef} className={`relative w-[824px] ${className}`}>
      <div className="search-bar-container">
        <div className="flex-1 flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-4">
            <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length > 1 && setIsDropdownOpen(true)}
            placeholder="Search products, industries, and experts"
            className="search-bar-input"
          />
        </div>
        <button className="search-bar-button">
          Find Your Software
        </button>
      </div>

      {/* Search Dropdown */}
      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute top-[32px] left-0 w-full pt-[48px] bg-white border border-secondary-light rounded-b-[32px] shadow-2xl z-10 overflow-hidden">
          <div className="py-4">
            {searchResults.map((product) => (
              <Link 
                key={product.product_id}
                href={`/products/${product.product_id}`}
                className="flex items-center gap-4 px-8 py-4 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  {product.product_logo ? (
                    <img src={product.product_logo} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-[14px] font-bold text-text-primary group-hover:text-cta-button">{product.product_name}</div>
                  <div className="text-[12px] text-gray-400 line-clamp-1 truncate italic">Software Product</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <Link href={`/products?search=${searchQuery}`} className="text-cta-button font-bold text-[12px] hover:underline">
              View all results for &quot;{searchQuery}&quot;
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
