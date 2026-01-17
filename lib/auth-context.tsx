"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"

interface AuthContextType {
  user: any | null
  loading: boolean
  signUp: (phone: string, password: string, name: string) => Promise<void>
  signIn: (phone: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (phone: string, password: string, name: string) => {
    try {
      console.log('Attempting signup for phone:', phone)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${phone}@kabadiwala.local`,
        password,
        options: {
          data: {
            name,
            phone,
          },
        },
      })

      if (authError) {
        console.error('Auth error:', authError)
        throw new Error(authError.message || 'Signup failed')
      }

      console.log('Auth signup successful:', authData.user?.id)

      // Create user profile - RLS policy should allow this after signup
      if (authData.user) {
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: authData.user.id,
          name,
          phone,
          verified: false,
          total_collections: 0,
          total_earnings: 0,
        })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw new Error(profileError.message || 'Profile creation failed')
        }
        
        console.log('User profile created successfully')
      }

      // Sign out after registration so user must login explicitly
      await supabase.auth.signOut()
      console.log('User signed out after registration')
    } catch (error) {
      console.error('SignUp error:', error)
      throw error
    }
  }

  const signIn = async (phone: string, password: string) => {
    try {
      console.log('Attempting signin for phone:', phone)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${phone}@kabadiwala.local`,
        password,
      })

      if (error) {
        console.error('SignIn error:', error)
        throw new Error(error.message || 'Login failed')
      }
      
      console.log('SignIn successful:', data.user?.id)
    } catch (error) {
      console.error('SignIn error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
