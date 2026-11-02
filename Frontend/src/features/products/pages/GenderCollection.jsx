import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useProduct } from '../hooks/useProduct.js'

export default function GenderCollection({ gender }) {
  const { handleGetAllProducts } = useProduct()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    handleGetAllProducts(gender)
      .then((list) => setProducts(list || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [gender])

  return (
    <section className="bg-white min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-8 md:px-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-6 sm:mb-10 pb-4 border-b border-gray-200">
        <p style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#777' }} className="uppercase font-semibold">COLLECTION</p>
        <h1 style={{ fontFamily: "'Bodoni Moda', serif", letterSpacing: '0.1em', textTransform: 'uppercase' }} className="text-2xl sm:text-3xl md:text-4xl font-normal mt-1">
          {gender}
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest">Loading pieces…</p>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center py-20 sm:py-24" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '22px', color: '#999' }}>
          No products found
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
          {products.map((p) => (
            <div key={p._id} className="group cursor-pointer flex flex-col" onClick={() => navigate(`/product/${p._id}`)}>
              <div className="overflow-hidden bg-gray-100 mb-2.5 sm:mb-4 relative" style={{ aspectRatio: '3/4' }}>
                <img
                  src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80'}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: 'grayscale(15%)' }}
                />
              </div>
              <h3 style={{ fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.03em' }} className="line-clamp-1 text-black">
                {p.title}
              </h3>
              <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-black mt-1">
                ₹{p.price?.amount?.toLocaleString('en-IN')}
                <span className="text-[10px] text-gray-400 ml-1 font-normal">{p.price?.currency}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
