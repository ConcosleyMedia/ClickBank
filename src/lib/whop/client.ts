import type { WhopApiResponse, WhopMembership } from '@/types'

const WHOP_API_BASE = 'https://api.whop.com/api/v2'

interface WhopClientConfig {
  apiKey: string
}

class WhopClient {
  private apiKey: string

  constructor(config: WhopClientConfig) {
    this.apiKey = config.apiKey
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WhopApiResponse<T>> {
    try {
      const response = await fetch(`${WHOP_API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.text()
        return { data: null, error: `Whop API error: ${error}` }
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getMembership(membershipId: string): Promise<WhopApiResponse<WhopMembership>> {
    return this.request<WhopMembership>(`/memberships/${membershipId}`)
  }

  async getMembershipByEmail(email: string): Promise<WhopApiResponse<WhopMembership[]>> {
    return this.request<WhopMembership[]>(`/memberships?email=${encodeURIComponent(email)}`)
  }

  async cancelMembership(membershipId: string): Promise<WhopApiResponse<WhopMembership>> {
    return this.request<WhopMembership>(`/memberships/${membershipId}/cancel`, {
      method: 'POST',
    })
  }
}

// Singleton instance
let whopClient: WhopClient | null = null

export function getWhopClient(): WhopClient {
  if (!whopClient) {
    const apiKey = process.env.WHOP_API_KEY
    if (!apiKey) {
      throw new Error('WHOP_API_KEY is not configured')
    }
    whopClient = new WhopClient({ apiKey })
  }
  return whopClient
}

export { WhopClient }
