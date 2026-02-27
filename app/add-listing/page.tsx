'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AddListing() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Softie')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Insert the new coral into your Supabase table
    const { error } = await supabase
      .from('listings')
      .insert([{ 
        title, 
        price: parseFloat(price), 
        category,
        image_url: 'https://placehold.co/400' // Placeholder for now
      }])

    if (error) {
      alert("Error: " + error.message)
      setLoading(false)
    } else {
      // If successful, send user back to the home page
      router.push('/')
      router.refresh() 
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">List a New Frag</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <label className="block text-sm mb-2">Coral Name</label>
            <input 
              required
              className="w-full p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-cyan-500"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Price ($)</label>
            <input 
              required
              type="number"
              className="w-full p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-cyan-500"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Category</label>
            <select 
              className="w-full p-2 bg-slate-800 rounded border border-slate-700 outline-none focus:border-cyan-500"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Softie">Softie</option>
              <option value="LPS">LPS</option>
              <option value="SPS">SPS</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 p-3 rounded-lg font-bold hover:bg-cyan-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </main>
  )
}