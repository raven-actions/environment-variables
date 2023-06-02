import { setFailed, logWarning } from './utils'
import { getGitHubToken, getInputs } from './input-helper'
import { getGitHub, getOctokit } from './action-provider'
import { fetchDeployEnvVars } from './fetch-deployenv-vars'
import { setOutputs } from './output-helper'

export async function main(): Promise<void> {
  try {
    const githubToken = getGitHubToken()
    const { repository } = getGitHub(githubToken)
    const inputs = getInputs(repository)
    const octokit = getOctokit(githubToken)
    if (inputs.dryRun) logWarning('Dry-run mode enabled, no changes will be made!')
    const deployEnvVars = await fetchDeployEnvVars(octokit, inputs.repository, inputs.deployEnvironment)
    setOutputs(deployEnvVars.variables, inputs.outputTo, inputs.envPrefix, inputs.dryRun)
  } catch (error) {
    setFailed(error as Error)
  }
  process.exit()
}

main()
