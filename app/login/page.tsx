'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email for the confirmation link!')
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-cyan-400">Reefer Login</h1>
        <input 
          type="email" placeholder="Email" 
          className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 bg-slate-800 rounded border border-slate-700 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={handleLogin} className="flex-1 bg-cyan-600 p-2 rounded font-bold text-white">Login</button>
          <button onClick={handleSignUp} className="flex-1 border border-slate-700 p-2 rounded font-bold text-white">Sign Up</button>
        </div>
      </div>
    </main>
  )
}