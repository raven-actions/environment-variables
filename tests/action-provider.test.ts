import { getGitHub, getOctokit } from '../src/action-provider'

describe('action-provider', () => {
  it('should get GitHub', () => {
    const github = getGitHub('token')
    expect(github).toBeDefined()
  })

  it('should get Octokit', () => {
    const octokit = getOctokit('token')
    expect(octokit).toBeDefined()
  })
})
