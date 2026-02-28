'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      return alert("Please fill in all fields (Email, Password, and Username)")
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // This sends the name to our Database Trigger
        }
      }
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Signup successful! Welcome to the reef community.')
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-cyan-400">Join Coral Carole</h1>
        
        {/* Username Input - New! */}
        <input 
          placeholder="Choose a Username" 
          className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-white outline-none focus:border-cyan-500"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-white outline-none focus:border-cyan-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-white outline-none focus:border-cyan-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-2">
          <button 
            disabled={loading}
            onClick={handleLogin} 
            className="flex-1 bg-cyan-600 p-2 rounded font-bold text-white hover:bg-cyan-500 transition-colors disabled:opacity-50"
          >
            Login
          </button>
          <button 
            disabled={loading}
            onClick={handleSignUp} 
            className="flex-1 border border-slate-700 p-2 rounded font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Sign Up
          </button>
        </div>
      </div>
    </main>
  )
}