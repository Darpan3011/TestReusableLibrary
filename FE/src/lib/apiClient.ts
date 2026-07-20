import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../config'

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null
  private isRefreshing: boolean = false
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true // Send cookies for OAuth2 sessions
    })
    // For OAuth2, we need to use relative URLs so cookies are sent
    // Base URLs are proxied by Vite dev server; in prod, serve behind same origin
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers = config.headers ?? {}
        config.headers['Authorization'] = `Bearer ${this.token}`
      }
      
      // Dispatch event for UI popup to show which dependency is being called
      if (typeof window !== 'undefined' && config.url) {
        let dependency = 'rate-limiter-core'
        if (config.url.startsWith('/auth') || config.url.startsWith('/profile')) {
          dependency = 'darpan-security-starter'
        } else if (config.url.startsWith('/smpp') || config.url.startsWith('/email')) {
          dependency = 'darpan-communication-starter'
        } else if (config.url.startsWith('/aidb')) {
          dependency = 'darpan-ai-database-agent'
        }

        window.dispatchEvent(new CustomEvent('api-call-tracker', {
          detail: {
            url: config.url,
            method: config.method?.toUpperCase() || 'GET',
            dependency
          }
        }))
      }

      return config
    })
    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status
        const originalConfig: AxiosRequestConfig = error.config

        // Handle 429 (Too Many Requests) - Rate Limited
        if (status === 429) {
          const retryAfter = error.response?.headers?.['retry-after'] || error.response?.headers?.['Retry-After']
          const message = error.response?.data?.message || error.response?.data?.error || 'Too many requests'
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('rate-limited', {
              detail: { retryAfter: retryAfter ? parseInt(retryAfter) : null, message }
            }))
          }
          return Promise.reject(error)
        }

        // Prevent infinite loop: don't retry refresh endpoint
        if (originalConfig.url?.includes('/auth/refresh')) {
          return Promise.reject(error)
        }

        // Handle 401 (Unauthorized) and 403 (Forbidden) by attempting token refresh
        if (status === 401 || status === 403) {
          console.log(`[apiClient] Received ${status} error for ${originalConfig.url}, attempting token refresh...`)
          if (typeof window !== 'undefined') {
            const refresh = localStorage.getItem('refreshToken')
            console.log('[apiClient] Refresh token check:', {
              hasRefreshToken: !!refresh,
              refreshTokenLength: refresh?.length || 0,
              refreshTokenValue: refresh ? `${refresh.substring(0, 20)}...` : 'null/undefined'
            })

            // Only attempt JWT refresh if we have a refresh token
            // OAuth2 users won't have refresh tokens (they use server sessions)
            if (refresh) {
              console.log('[apiClient] Found refresh token, proceeding with JWT refresh')
              // If already refreshing, wait for that refresh to complete
              if (this.isRefreshing && this.refreshPromise) {
                console.log('[apiClient] Refresh already in progress, waiting...')
                try {
                  await this.refreshPromise
                  // Retry original request with new token
                  return this.client.request(originalConfig)
                } catch (refreshError) {
                  return Promise.reject(refreshError)
                }
              }

              // Start a new refresh
              this.isRefreshing = true
              console.log('[apiClient] Starting token refresh...')
              this.refreshPromise = (async () => {
                try {
                  console.log('[apiClient] Calling /auth/ with refresh token')
                  const { data } = await this.client.post('/auth/refresh', undefined, { params: { token: refresh } })
                  console.log('[apiClient] Token refresh successful:', { hasAccessToken: !!data.accessToken, hasRefreshToken: !!data.refreshToken })
                  this.setAccessToken(data.accessToken)
                  localStorage.setItem('accessToken', data.accessToken)
                  if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)

                  // Dispatch custom event to notify AuthContext
                  window.dispatchEvent(new CustomEvent('token-refreshed', {
                    detail: {
                      accessToken: data.accessToken,
                      refreshToken: data.refreshToken
                    }
                  }))

                  return data.accessToken
                } catch (refreshError: any) {
                  console.error('[apiClient] Token refresh failed:', refreshError.response?.status, refreshError.response?.data || refreshError.message)
                  // Refresh failed, clear tokens
                  localStorage.removeItem('accessToken')
                  localStorage.removeItem('refreshToken')
                  this.setAccessToken(null)

                  // Dispatch custom event to notify AuthContext
                  console.log('[apiClient] Dispatching token-refresh-failed event')
                  window.dispatchEvent(new CustomEvent('token-refresh-failed'))

                  // Explicitly call logout to invalidate server session (JSESSIONID)
                  try {
                    await this.client.post('/logout')
                    console.log('[apiClient] Server session invalidated')
                  } catch (e) {
                    console.error('[apiClient] Failed to invalidate server session', e)
                  }

                  // Only redirect to login if this was NOT a /auth/me request (which is used to check auth status)
                  const isAuthCheck = originalConfig.url?.includes('/auth/me')
                  if (!isAuthCheck && window.location.pathname !== '/login') {
                    console.log('[apiClient] Redirecting to login due to refresh failure')
                    window.location.href = '/login'
                  }
                  throw refreshError
                } finally {
                  this.isRefreshing = false
                  this.refreshPromise = null
                }
              })()

              try {
                await this.refreshPromise
                console.log('[apiClient] Retrying original request with new token')
                // Retry original request with new token
                return this.client.request(originalConfig)
              } catch (refreshError) {
                return Promise.reject(refreshError)
              }
            } else {
              // No refresh token - this is either OAuth2 or user needs to login
              console.log('[apiClient] No refresh token found - skipping JWT refresh (likely OAuth2 or logged out)')

              // For OAuth2, don't redirect on /auth/me failures (it's just checking session)
              // For other endpoints, let the error propagate so the UI can handle it
              const isAuthCheck = originalConfig.url?.includes('/auth/me')
              if (!isAuthCheck && window.location.pathname !== '/login' && window.location.pathname !== '/') {
                console.log('[apiClient] Redirecting to login - no valid session')
                window.location.href = '/login'
              }
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  setAccessToken(token: string | null) {
    this.token = token
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, config)
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(url, data, config)
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, config)
  }
}

export const apiClient = new ApiClient()
