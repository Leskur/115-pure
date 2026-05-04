import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const BASE_URL = 'https://proapi.115.com'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await useAuthStore.getState().refreshToken()
        const token = useAuthStore.getState().accessToken
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      } catch {
        useAuthStore.getState().logout()
      }
    }
    return Promise.reject(error)
  }
)
