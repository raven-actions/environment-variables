import * as utils from '../src/utils'
import { getGitHubToken, getInputs } from '../src/input-helper'

describe('input-helper', () => {
  const mockRepo = { name: 'test-owner/test-repo', repo: { owner: 'test-owner', repo: 'test-repo' } }
  let mockInputs = {} as any
  jest.spyOn(utils.core, 'getInput').mockImplementation((name: string) => {
    return mockInputs[name]
  })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  afterEach(() => {
    mockInputs = {}
  })

  it('should get GitHub token - input supplied', () => {
    mockInputs['github-token'] = 'test'
    const token = getGitHubToken()
    expect(token).toEqual('test')
  })

  it('should get GitHub token - input no supplied, from env', () => {
    const token = getGitHubToken()
    expect(token).toEqual('456def')
  })

  it('should get inputs - minimal required', () => {
    mockInputs['environment'] = 'test'
    const inputs = getInputs(mockRepo)
    expect(inputs).toEqual({
      repository: { name: 'test-owner/test-repo', repo: { owner: 'test-owner', repo: 'test-repo' } },
      outputTo: 'all',
      envPrefix: '',
      deployEnvironment: 'test',
      dryRun: false
    })
  })

  it('should get inputs - all', () => {
    mockInputs['environment'] = 'test'
    mockInputs['repository'] = 'test/test'
    mockInputs['output-to'] = 'env'
    mockInputs['env-prefix'] = 'test'
    mockInputs['dry-run'] = 'true'
    const inputs = getInputs(mockRepo)
    expect(inputs).toEqual({
      repository: { name: 'test/test', repo: { owner: 'test', repo: 'test' } },
      outputTo: 'env',
      envPrefix: 'test',
      deployEnvironment: 'test',
      dryRun: true
    })
  })
})
