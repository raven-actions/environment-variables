import { setFailed, logWarning } from './utils.js'
import { getGitHubToken, getInputs } from './input-helper.js'
import { getGitHub, getOctokit } from './action-provider.js'
import { fetchDeployEnvVars } from './fetch-deployenv-vars.js'
import { setOutputs } from './output-helper.js'

export async function run(): Promise<void> {
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
