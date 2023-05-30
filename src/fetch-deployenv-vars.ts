import {logDebug, logInfo} from './utils'
import {Octokit, RestEndpointMethodTypes, RequestError, Repo} from './github-provider'
import {getRepo} from './get-repo'

export type listEnvironmentVariables = RestEndpointMethodTypes['actions']['listEnvironmentVariables']['response']

export async function fetchDeployEnvVars(octokit: Octokit, repository: Repo, deployEnvironment: string): Promise<listEnvironmentVariables['data']> {
  const {id: repositoryId} = await getRepo(octokit, repository)
  const {data} = await tryFetchDeployEnvVars(octokit, deployEnvironment, repositoryId)
  logInfo(`Found ${data.total_count} variables for '${deployEnvironment}' environment in '${repository.name}' repository`)
  return data
}

async function tryFetchDeployEnvVars(octokit: Octokit, deployEnvironment: string, repositoryId: number): Promise<listEnvironmentVariables> {
  try {
    logDebug(`Fetching '${deployEnvironment}' environment variables...`)
    // https://docs.github.com/en/rest/actions/variables#list-environment-variables
    // pagination not required, as there is a limit of 100 variables per environment
    return await octokit.rest.actions.listEnvironmentVariables({
      repository_id: repositoryId,
      environment_name: deployEnvironment,
      per_page: 100
    })
  } catch (error) {
    if (error instanceof RequestError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`'${deployEnvironment}' environment - ${error.status} ${(error.response?.data as any).message}`)
    } else {
      // catch unknown error
      throw new Error((error as Error).message)
    }
  }
}
