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
    <section className="bg-white min-h-screen py-16 px-8 md:px-16" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-10 pb-4 border-b border-gray-200">
        <p style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#777' }}>COLLECTION</p>
        <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '32px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {gender}
        </h1>
      </div>

      {loading ? (
        <p className="text-center py-24 text-gray-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-center py-24" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '24px', color: '#999' }}>
          No products found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div key={p._id} className="cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
              <div className="overflow-hidden bg-gray-100 mb-4" style={{ aspectRatio: '3/4' }}>
                <img src={p.images?.[0]?.url} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 500, textTransform: 'uppercase' }} className="line-clamp-1">{p.title}</h3>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>₹{p.price?.amount?.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}