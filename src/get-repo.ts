import { logDebug } from './utils'
import { Octokit, RestEndpointMethodTypes, RequestError, Repository } from './action-provider'

type ghRepo = RestEndpointMethodTypes['repos']['get']['response']

const NAME = 'Repository'

export async function getRepo(octokit: Octokit, repository: Repository): Promise<ghRepo['data']> {
  const { data } = await tryGet(octokit, repository)
  return data
}

export async function tryGet(octokit: Octokit, repository: Repository): Promise<ghRepo> {
  try {
    logDebug(`Getting '${repository.name}' ${NAME}...`)
    // https://docs.github.com/en/rest/repos/repos#get-a-repository
    return await octokit.rest.repos.get({
      ...repository.repo
    })
  } catch (error) {
    if (error instanceof RequestError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Get '${repository.name}' ${NAME} - ${error.status} ${(error.response?.data as any).message}`)
    } else {
      // catch unknown error
      throw new Error((error as Error).message)
    }
  }
}
