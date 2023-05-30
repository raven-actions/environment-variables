import {setFailed, exitFailure, exitSuccess} from './utils'
import {getGitHubToken, getInputs} from './input-helper'
import {getGitHub, getOctokit} from './github-provider'
import {fetchDeployEnvVars} from './fetch-deployenv-vars'
import {setOutputs} from './output-helper'

export async function main(): Promise<void> {
  try {
    const githubToken = getGitHubToken()
    const {repo} = getGitHub(githubToken)
    const inputs = getInputs(repo)
    const octokit = getOctokit(githubToken)
    const deployEnvVars = await fetchDeployEnvVars(octokit, inputs.repository, inputs.deployEnvironment)
    setOutputs(deployEnvVars.variables, inputs.outputTo, inputs.envPrefix)
    exitSuccess()
  } catch (error) {
    setFailed(error as Error)
    exitFailure()
  }
}

main()
