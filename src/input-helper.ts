import {Repo} from './github-provider'
import {getInputOptional, getInputRequired, getInputChoice, getInputRepository} from './utils'

export type Input = {
  repository: Repo
  outputTo: string
  envPrefix: string
  deployEnvironment: string
}

export function getGitHubToken(): string {
  return getInputRequired('github-token', process.env.GITHUB_TOKEN)
}

export function getInputs(contextRepo: Repo): Input {
  // repository
  let repository: Repo
  const repositoryInput = getInputRepository('repository')
  if (repositoryInput) {
    repository = repositoryInput
  } else {
    repository = contextRepo
  }

  // environment
  const deployEnvironment = getInputRequired('environment')

  // output-to
  const outputTo = getInputChoice('output-to', 'all', ['all', 'action', 'env'])

  // env-prefix
  const envPrefix = getInputOptional('env-prefix')

  return {repository, deployEnvironment, outputTo, envPrefix}
}
