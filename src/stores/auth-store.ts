import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { supabase } from '@/lib/supabase'
import { ROLES } from '@/lib/roles'
import type { User } from '@supabase/supabase-js'

const ACCESS_TOKEN = 'supabase_access_token'

interface AuthUser {
  id: string
  email: string
  role?: string[]
  accountNo?: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    supabaseUser: User | null
    setUser: (user: AuthUser | null) => void
    setSupabaseUser: (user: User | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    initialize: () => Promise<void>
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // Initialize from cookie if available
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  
  return {
    auth: {
      user: null,
      supabaseUser: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      setSupabaseUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, supabaseUser: user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, supabaseUser: null, accessToken: '' },
          }
        }),
      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user && session?.access_token) {
            // Get user role from database
            const { data: userRoleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('id', session.user.id)
              .single()

            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              role: userRoleData?.role ? [userRoleData.role] : [ROLES.CUSTOMER],
            }
            const state = get()
            state.auth.setSupabaseUser(session.user)
            state.auth.setUser(authUser)
            state.auth.setAccessToken(session.access_token)
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
        }
      },
    },
  }
})

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  const { auth } = useAuthStore.getState()
  
  if (event === 'SIGNED_IN' && session?.user && session?.access_token) {
    // Get user role from database
    supabase
      .from('user_roles')
      .select('role')
      .eq('id', session.user.id)
      .single()
      .then(({ data: userRoleData }) => {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          role: userRoleData?.role ? [userRoleData.role] : [ROLES.CUSTOMER],
        }
        useAuthStore.getState().auth.setSupabaseUser(session.user)
        useAuthStore.getState().auth.setUser(authUser)
        useAuthStore.getState().auth.setAccessToken(session.access_token)
      })
      .catch(() => {
        // Fallback if role fetch fails
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          role: [ROLES.CUSTOMER],
        }
        useAuthStore.getState().auth.setSupabaseUser(session.user)
        useAuthStore.getState().auth.setUser(authUser)
        useAuthStore.getState().auth.setAccessToken(session.access_token)
      })
  } else if (event === 'SIGNED_OUT') {
    auth.reset()
  }
})
