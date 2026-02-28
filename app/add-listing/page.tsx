'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AddListing() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Softie')
  
  const [imageFile, setImageFile] = useState<File | null>(null) // State for the file
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
    }
    checkUser()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) return alert("You MUST upload an image!") // 100% Necessity Check
    
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      // 1. Generate a unique filename
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // 2. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('coral-images')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      // 3. Get the Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('coral-images')
        .getPublicUrl(filePath)

      // 4. Create the Database Record
      const { error: dbError } = await supabase
        .from('listings')
        .insert([{ 
          title, 
          price: parseFloat(price), 
          category,
          seller_id: user.id,
          image_url: publicUrl, // Using the REAL URL now
          is_lfs_verified: false 
        }])

      if (dbError) throw dbError
      
      router.push('/')
      router.refresh()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white font-sans">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">List Your Coral</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl">
          {/* Coral Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Coral Name</label>
            <input required placeholder="e.g. Blue Tenuis" className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Photo Upload (The New Requirement) */}
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:border-cyan-500 transition-colors">
            <label className="block text-sm font-semibold mb-2 text-slate-300 cursor-pointer">
              📸 Upload Photo (Required)
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                required
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              />
            </label>
            {imageFile && <p className="text-xs text-cyan-400 mt-2">Selected: {imageFile.name}</p>}
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Price ($)</label>
              <input required type="number" placeholder="50" className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Category</label>
              <select className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" onChange={(e) => setCategory(e.target.value)}>
                <option value="Softie">Softie</option>
                <option value="LPS">LPS</option>
                <option value="SPS">SPS</option>
                <option value="Fish">Fish</option>
                <option value="Inverts">Inverts</option>
                <option value="Equipment">Equipment</option>
                <option value="Additives">Additives</option>
              </select>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 p-3 rounded-lg font-bold text-white transition-all disabled:opacity-50">
            {loading ? 'Uploading Frag...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </main>
  )
}