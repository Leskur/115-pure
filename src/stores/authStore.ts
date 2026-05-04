import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { refreshAccessToken } from '@/api/auth'
import type { UserInfo } from '@/types'

const CLIENT_ID = import.meta.env.VITE_115_CLIENT_ID as string

interface AuthState {
  accessToken: string | null
  refreshTokenValue: string | null
  expiresAt: number | null
  user: UserInfo | null
  isAuthenticated: boolean
  setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => void
  setUser: (user: UserInfo) => void
  refreshToken: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshTokenValue: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken, expiresIn) => {
        set({
          accessToken,
          refreshTokenValue: refreshToken,
          expiresAt: Date.now() + expiresIn * 1000,
          isAuthenticated: true,
        })
      },

      setUser: (user) => set({ user }),

      refreshToken: async () => {
        const { refreshTokenValue } = get()
        if (!refreshTokenValue) throw new Error('No refresh token')
        const tokens = await refreshAccessToken(refreshTokenValue, CLIENT_ID)
        get().setTokens(tokens.access_token, tokens.refresh_token, tokens.expires_in)
      },

      logout: () => {
        set({
          accessToken: null,
          refreshTokenValue: null,
          expiresAt: null,
          user: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: '115-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshTokenValue: state.refreshTokenValue,
        expiresAt: state.expiresAt,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
