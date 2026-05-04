import { useState, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { useAuthStore } from '@/stores/authStore'
import { getUserInfo } from '@/api/user'
import type { AuthTokens } from '@/types'

const CLIENT_ID = import.meta.env.VITE_115_CLIENT_ID as string

interface PkceParams {
  code_verifier: string
  code_challenge: string
  state: string
  redirect_uri: string
  auth_url: string
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setTokens, setUser, logout, isAuthenticated } = useAuthStore()

  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const pkce = await invoke<PkceParams>('create_pkce_params', {
        clientId: CLIENT_ID,
      })

      await invoke('open_browser_auth', { url: pkce.auth_url })

      const code = await invoke<string>('wait_for_auth_callback', {
        expectedState: pkce.state,
      })

      const tokens = await invoke<AuthTokens>('exchange_code_for_tokens', {
        code,
        codeVerifier: pkce.code_verifier,
        clientId: CLIENT_ID,
      })

      setTokens(tokens.access_token, tokens.refresh_token, tokens.expires_in)

      const userRes = await getUserInfo()
      setUser(userRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }, [setTokens, setUser])

  return { login, logout, isLoading, error, isAuthenticated }
}
