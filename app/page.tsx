'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [listings, setListings] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const supabase = createClient()

  const categories = ['Softie', 'LPS', 'SPS', 'Fish', 'Inverts']

  useEffect(() => {
    async function fetchData() {
      // Fetching all listings + related profile username
      let query = supabase.from('listings').select(`
        *,
        profiles (
          username
        )
      `)
      
      if (selectedCategories.length > 0) {
        query = query.in('category', selectedCategories)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) console.error("Error fetching:", error)
      setListings(data || [])
    }
    fetchData()
  }, [selectedCategories, supabase])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-cyan-400">Filters</h2>
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Category</p>
          {categories.map(cat => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span className={`transition-colors ${selectedCategories.includes(cat) ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Latest Listings</h1>
          <Link href="/add-listing">
            <button className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg font-bold transition-all">
              + List Item
            </button>
          </Link>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(item => (
            <div key={item.id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all group">
               <div className="relative h-48">
                  <Image 
                    src={item.image_url} 
                    alt={item.title} 
                    fill 
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
               </div>
               <div className="p-4">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg">{item.title}</h3>
                   <span className="text-cyan-400 font-bold">${item.price}</span>
                 </div>
                 
                 <div className="flex justify-between items-center mt-4">
                   <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase">
                    {item.category}
                   </span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyan-900 flex items-center justify-center text-[10px] text-cyan-200 uppercase">
                      {/* Prioritize Username initial, then fallback to '?' */}
                      {item.profiles?.username?.[0] || '?'}
                    </div>
                    <span className="text-xs text-slate-500">
                      {/* Only show the username if it exists */}
                      {item.profiles?.username || 'Legacy User'}
                    </span>
                  </div>
                 </div>
               </div>
            </div> /* <--- Added this missing closing div */
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No items found in these categories.
          </div>
        )}
      </section>
    </main>
  )
}