import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getMockOctokit, getMockRequestError } from './helpers.ts'
import { fetchDeployEnvVars } from '../src/fetch-deployenv-vars.ts'

describe('fetch-deployenv-vars', () => {
  const mockRepo = {
    name: 'test-owner/test-repo',
    repo: { owner: 'test-owner', repo: 'test-repo' }
  }
  const mockDeployEnvironment = 'test-environment'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should return environment variables', async () => {
    const mockOctokit = getMockOctokit({
      rest: {
        repos: {
          get: vi.fn().mockResolvedValueOnce({ status: 200, data: { id: 1 } })
        },
        actions: {
          listEnvironmentVariables: vi.fn().mockResolvedValueOnce({
            status: 200,
            data: {
              total_count: 2,
              variables: [
                { name: 'test-var-1', value: 'test1' },
                { name: 'test-var-2', value: 'test2' }
              ]
            }
          })
        }
      }
    })
    const result = await fetchDeployEnvVars(mockOctokit, mockRepo, mockDeployEnvironment)
    expect(result.total_count).toEqual(2)
    expect(result.variables).toHaveLength(2)
  })

  it('should throw an error when environment not found', async () => {
    const mockOctokit = getMockOctokit({
      rest: {
        repos: {
          get: vi.fn().mockResolvedValueOnce({ status: 200, data: { id: 1 } })
        },
        actions: {
          listEnvironmentVariables: vi.fn().mockRejectedValueOnce(getMockRequestError('Not Found', 404))
        }
      }
    })
    await expect(fetchDeployEnvVars(mockOctokit, mockRepo, mockDeployEnvironment)).rejects.toThrow(
      `Fetch '${mockDeployEnvironment}' Environment variables - 404 Not Found`
    )
  })

  it('should throw an error when access to environment forbidden', async () => {
    const mockOctokit = getMockOctokit({
      rest: {
        repos: {
          get: vi.fn().mockResolvedValueOnce({ status: 200, data: { id: 1 } })
        },
        actions: {
          listEnvironmentVariables: vi.fn().mockRejectedValueOnce(getMockRequestError('Forbidden', 403))
        }
      }
    })
    await expect(fetchDeployEnvVars(mockOctokit, mockRepo, mockDeployEnvironment)).rejects.toThrow(
      `Fetch '${mockDeployEnvironment}' Environment variables - 403 Forbidden`
    )
  })

  it('should throw an error when unknown error during getting environment variables', async () => {
    const mockOctokit = getMockOctokit({
      rest: {
        repos: {
          get: vi.fn().mockResolvedValueOnce({ status: 200, data: { id: 1 } })
        },
        actions: {
          listEnvironmentVariables: vi.fn().mockRejectedValueOnce(new Error('Server Error'))
        }
      }
    })
    await expect(fetchDeployEnvVars(mockOctokit, mockRepo, mockDeployEnvironment)).rejects.toThrow(`Server Error`)
  })
})
