import { logDebug, logInfo } from './utils.js'
import { Octokit, RestEndpointMethodTypes, RequestError, Repository } from './action-provider.js'
import { getRepo } from './get-repo.js'
import { context } from '@actions/github'

export type ghEnvironmentVariables = RestEndpointMethodTypes['actions']['listEnvironmentVariables']['response']

const NAME = 'Environment variables'

export async function fetchDeployEnvVars(
  octokit: Octokit,
  repository: Repository,
  deployEnvironment: string
): Promise<ghEnvironmentVariables['data']> {
  const { id: repositoryId } = await getRepo(octokit, repository)
  const { data } = await tryFetch(octokit, deployEnvironment, repositoryId)
  logInfo(`Found ${data.total_count} ${NAME} in '${repository.name}' repository`)
  return data
}

async function tryFetch(
  octokit: Octokit,
  deployEnvironment: string,
  repositoryId: number
): Promise<ghEnvironmentVariables> {
  try {
    logDebug(`Fetching '${deployEnvironment}' ${NAME}...`)
    // https://docs.github.com/en/rest/actions/variables#list-environment-variables
    // pagination not required, as there is a limit of 100 variables per environment
    return await octokit.rest.actions.listEnvironmentVariables({
      repository_id: repositoryId,
      environment_name: deployEnvironment,
      per_page: 100,
      owner: context.repo.owner,
      repo: context.repo.repo
    })
  } catch (error) {
    if (error instanceof RequestError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Fetch '${deployEnvironment}' ${NAME} - ${error.status} ${(error.response?.data as any).message}`)
    } else {
      // catch unknown error
      throw new Error((error as Error).message)
    }
  }
}
