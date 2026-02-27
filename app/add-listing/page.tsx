'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AddListing() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Softie')
  const [lighting, setLighting] = useState('Medium')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  // Guard the page: Redirect to login if user isn't authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Fetch the logged-in user to get their ID
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      alert("You must be logged in to post a listing.")
      router.push('/login')
      setLoading(false)
      return
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('listings')
      .insert([{ 
        title: title, 
        price: parseFloat(price), 
        category: category,
        lighting: lighting,
        seller_id: user.id, // Links the listing to the authenticated user
        image_url: 'https://placehold.co/400',
        is_lfs_verified: false 
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
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none text-white"
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
                className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none text-white"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select 
                className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none text-white appearance-none"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
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
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none text-white appearance-none"
              onChange={(e) => setLighting(e.target.value)}
              value={lighting}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 p-3 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </main>
  )
}