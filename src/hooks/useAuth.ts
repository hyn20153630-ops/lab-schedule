import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export type AuthMode = 'loading' | 'signed-out' | 'signed-in' | 'guest'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
        if (nextSession) setIsGuest(false)
      },
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const user: User | null = session?.user ?? null

  const mode: AuthMode = loading
    ? 'loading'
    : user
      ? 'signed-in'
      : isGuest
        ? 'guest'
        : 'signed-out'

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        // 로그아웃 후 다시 로그인할 때 항상 같은 구글 계정으로 자동 로그인되지 않도록 계정 선택 화면을 강제한다.
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  async function signOut() {
    if (isSupabaseConfigured) await supabase.auth.signOut()
    setIsGuest(false)
  }

  function continueAsGuest() {
    setIsGuest(true)
  }

  return { mode, user, signInWithGoogle, signOut, continueAsGuest }
}
