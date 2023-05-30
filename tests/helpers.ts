import {Octokit, RequestError, RequestMethod} from '../src/github-provider'

export function getMockOctokit(octokitMock: any): Octokit {
  return octokitMock as Octokit
}

export function getMockRequestError(message: string, status: number, method: RequestMethod = 'GET'): RequestError {
  return new RequestError(message, status, {
    response: {data: {message}, headers: {}, status, url: 'https://test'},
    request: {method, url: 'https://test', headers: {}}
  })
}
