import { apiClient } from './client'
import type { UserInfo } from '@/types'

export async function getUserInfo(): Promise<{ data: UserInfo }> {
  const response = await apiClient.get('/open/user/info')
  return response.data
}
