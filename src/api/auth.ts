import axios from 'axios'
import type { AuthTokens } from '@/types'

const BASE_URL = 'https://proapi.115.com'

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  clientId: string,
  redirectUri: string
): Promise<AuthTokens> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    code_verifier: codeVerifier,
    client_id: clientId,
    redirect_uri: redirectUri,
  })
  const response = await axios.post(`${BASE_URL}/open/oauth/token`, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}

export async function refreshAccessToken(
  refreshToken: string,
  clientId: string
): Promise<AuthTokens> {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  })
  const response = await axios.post(`${BASE_URL}/open/oauth/token`, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return response.data
}
