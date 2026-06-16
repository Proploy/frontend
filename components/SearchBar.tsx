'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { getProductDetailHref, useKeywordSearch } from '@/features/catalog'

interface SearchBarProps {
  className?: string
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)

  const { products, loading, error, search, clear } = useKeywordSearch()

  // The hook debounces requests and invalidates any previous in-flight search.
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      void search(searchQuery)
    } else {
      clear()
    }
  }, [searchQuery, search, clear])

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

  const showDropdown = isDropdownOpen && searchQuery.trim().length > 1 && !loading && products.length > 0

  return (
    <div ref={searchBarRef} className={`relative w-full max-w-[824px] ${className}`}>
      <div className="search-bar-container">
        <div className="w-full md:flex-1 flex items-center gap-2 py-3 md:py-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-4 shrink-0">
            <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsDropdownOpen(true)
            }}
            onFocus={() => searchQuery.length > 1 && setIsDropdownOpen(true)}
            placeholder="Search products..."
            className="w-full h-10 md:h-full bg-transparent outline-none text-[15px] md:text-[16px] text-text-primary placeholder:text-gray-400 px-2"
          />
        </div>
      </div>

      {/* Loading indicator */}
      {loading && searchQuery.trim().length > 1 && (
        <div className="absolute top-full left-0 w-full bg-white border border-secondary-light rounded-2xl shadow-2xl z-50 overflow-hidden mt-2 p-4">
          <p className="text-[12px] text-gray-400 text-center">Searching...</p>
        </div>
      )}

      {/* Error state */}
      {error && searchQuery.trim().length > 1 && !loading && (
        <div className="absolute top-full left-0 w-full bg-white border border-secondary-light rounded-2xl shadow-2xl z-50 overflow-hidden mt-2 p-4">
          <p className="text-[12px] text-red-500 text-center">Unable to search</p>
        </div>
      )}

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 w-full bg-white border border-secondary-light rounded-2xl shadow-2xl z-50 overflow-hidden mt-2">
          <div className="py-4">
            {products.map((product) => (
              <Link
                key={product.product_id}
                href={getProductDetailHref(product.product_id)}
                className="flex items-center gap-4 px-8 py-4 hover:bg-blue-50 transition-colors group"
              >
                <div className="size-10 flex-shrink-0 bg-gray-50 rounded-lg p-1 border border-gray-100">
                  {product.product_logo ? (
                    <CatalogImage
                      src={product.product_logo}
                      alt=""
                      className="size-full object-contain"
                      fallback={<span className="flex size-full items-center justify-center font-bold text-[#155eef]">{product.product_name.charAt(0)}</span>}
                    />
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
