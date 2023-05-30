import {logDebug} from './utils'
import {Octokit, RestEndpointMethodTypes, RequestError, Repo} from './github-provider'

type ghRepo = RestEndpointMethodTypes['repos']['get']['response']

export async function getRepo(octokit: Octokit, repo: Repo): Promise<ghRepo['data']> {
  const {data} = await tryGetRepo(octokit, repo)
  return data
}

export async function tryGetRepo(octokit: Octokit, repository: Repo): Promise<ghRepo> {
  try {
    logDebug(`Getting '${repository.name}' repository...`)
    // https://docs.github.com/en/rest/repos/repos#get-a-repository
    return await octokit.rest.repos.get({
      ...repository.repo
    })
  } catch (error) {
    if (error instanceof RequestError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`'${repository.name}' repository - ${error.status} ${(error.response?.data as any).message}`)
    } else {
      // catch unknown error
      throw new Error((error as Error).message)
    }
  }
}
