import { Octokit, GitHub, RequestError, RequestMethod } from '../src/action-provider.ts'

export function getMockGitHub(octokitMock: any): GitHub {
  return octokitMock as GitHub
}

export function getMockOctokit(octokitMock: any): Octokit {
  return octokitMock as Octokit
}

export function getMockRequestError(message: string, status: number, method: RequestMethod = 'GET'): RequestError {
  return new RequestError(message, status, {
    response: { data: { message }, headers: {}, status, url: 'https://test' },
    request: { method, url: 'https://test', headers: {} }
  })
}
