import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useProduct } from '../hooks/useProduct.js'
import { ProductGridSkeleton } from '../../Shared/components/Loader.jsx'

export default function SearchResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const { handleGetAllProducts } = useProduct()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Read the search term from /search?q=shirt
  const query = new URLSearchParams(location.search).get('q') || ''
  const searchTerm = query.trim().toLowerCase()

  useEffect(() => {
    let isMounted = true

    handleGetAllProducts()
      .then((list) => {
        if (isMounted) setProducts(list || [])
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
        if (isMounted) setProducts([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Search by product title, description, or gender
  const filteredProducts = products.filter((product) => {
    return (
      product.title?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.gender?.toLowerCase().includes(searchTerm)
    )
  })

  return (
    <section
      className="min-h-screen bg-white px-4 py-10 sm:px-8 md:px-16"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="mb-8 border-b border-gray-200 pb-5">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-gray-500 uppercase">
          Search Results
        </p>

        <h1
          className="mt-2 text-2xl sm:text-3xl"
          style={{
            fontFamily: "'Bodoni Moda', serif",
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          {query ? `Results for "${query}"` : 'Search Products'}
        </h1>

        {!loading && searchTerm && (
          <p className="mt-2 text-xs text-gray-500">
            {filteredProducts.length} product(s) found
          </p>
        )}
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : !searchTerm ? (
        <p className="py-16 text-center text-gray-500">
          Enter a product name in the search bar.
        </p>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p
            className="text-xl text-gray-500"
            style={{ fontFamily: "'Bodoni Moda', serif" }}
          >
            No products found
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Try searching with another product name or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group flex cursor-pointer flex-col"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div
                className="mb-3 overflow-hidden bg-gray-100"
                style={{ aspectRatio: '3/4' }}
              >
                <img
                  src={
                    product.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80'
                  }
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="line-clamp-1 text-xs font-medium uppercase text-black sm:text-sm">
                {product.title}
              </h3>

              <p className="mt-1 text-xs font-semibold text-black sm:text-sm">
                ₹{product.price?.amount?.toLocaleString('en-IN')}
                <span className="ml-1 text-[10px] font-normal text-gray-400">
                  {product.price?.currency}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}