'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AddListing() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Softie') // Default
  const [lighting, setLighting] = useState('Medium') // Default
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Insert into Supabase
    const { error } = await supabase
      .from('listings')
      .insert([{ 
        title, 
        price: parseFloat(price), 
        category, 
        lighting,
        image_url: 'https://via.placeholder.com/400' // We will do image uploads next!
      }])

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">List Your Coral</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <label className="block text-sm font-medium mb-2">Coral Name</label>
            <input 
              required
              placeholder="e.g. Blue Tenuis" 
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price ($)</label>
              <input 
                required
                type="number"
                placeholder="50" 
                className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Softie">Softie</option>
                <option value="LPS">LPS</option>
                <option value="SPS">SPS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Lighting Requirement</label>
            <select 
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none"
              onChange={(e) => setLighting(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 p-3 rounded-lg font-bold text-white transition-all disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </main>
  )
}