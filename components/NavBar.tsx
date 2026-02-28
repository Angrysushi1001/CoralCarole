'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  // We rename this to displayName since it could be an email or a username
  const [displayName, setDisplayName] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Function to fetch the profile username
    const fetchProfile = async (user: any) => {
      if (!user) {
        setDisplayName(null)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      setDisplayName(profile?.username || user.email)
    }

    // 1. Check current session on load
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      fetchProfile(user)
    }
    checkUser()

    // 2. LISTEN for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user)
      } else {
        setDisplayName(null)
      }
    })

    // Clean up the subscription when the component unmounts
    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setDisplayName(null)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-cyan-400">
          Coral Carole 🪸
        </Link>
        
        <div className="flex items-center gap-4">
          {displayName ? (
            <>
              <span className="text-slate-400 text-sm">
                Logged in as <span className="text-cyan-400 font-bold">@{displayName}</span>
              </span>
              <Link href="/add-listing" className="text-slate-300 hover:text-white transition-colors">
                List Coral
              </Link>
              <button 
                onClick={handleSignOut}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded text-sm transition-colors border border-slate-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}