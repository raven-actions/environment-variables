import { getMockOctokit, getMockRequestError } from './helpers'
import { getRepo } from '../src/get-repo'

describe('get-repo', () => {
  const mockRepo = { name: 'test-owner/test-repo', repo: { owner: 'test-owner', repo: 'test-repo' } }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  it('should return repository', async () => {
    const octokit = getMockOctokit({
      rest: {
        repos: {
          get: jest.fn().mockResolvedValueOnce({ status: 200, data: { id: 1 } })
        }
      }
    })
    const result = await getRepo(octokit, mockRepo)
    expect(result.id).toEqual(1)
  })

  it('should throw an error when repository not found', async () => {
    const mockOctokit = getMockOctokit({
      rest: {
        repos: {
          get: jest.fn().mockRejectedValueOnce(getMockRequestError('Not Found', 404))
        }
      }
    })
    await expect(getRepo(mockOctokit, mockRepo)).rejects.toThrow(`Get '${mockRepo.name}' Repository - 404 Not Found`)
  })

  it('should throw an error when access to repository forbidden', async () => {
    const mockOctokit = getMockOctokit({
      rest: {
        repos: {
          get: jest.fn().mockRejectedValueOnce(getMockRequestError('Forbidden', 403))
        }
      }
    })
    await expect(getRepo(mockOctokit, mockRepo)).rejects.toThrow(`Get '${mockRepo.name}' Repository - 403 Forbidden`)
  })

  it('should throw an error when unknown error during getting repository', async () => {
    const mockOctokit = getMockOctokit({
      rest: {
        repos: {
          get: jest.fn().mockRejectedValueOnce(new Error('Server Error'))
        }
      }
    })
    await expect(getRepo(mockOctokit, mockRepo)).rejects.toThrow(`Server Error`)
  })
})
