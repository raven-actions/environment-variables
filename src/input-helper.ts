import { Repository } from './action-provider.js'
import { getInputOptional, getInputRequired, getInputChoice, getInputRepository, getInputBoolean } from './utils.js'

export type Input = {
  repository: Repository
  outputTo: string
  envPrefix: string
  deployEnvironment: string
  dryRun: boolean
}

export function getGitHubToken(): string {
  return getInputRequired('github-token', process.env.GITHUB_TOKEN)
}

export function getInputs(contextRepository: Repository): Input {
  // environment
  const deployEnvironment = getInputRequired('environment')

  // repository
  let repository: Repository
  const repositoryInput = getInputRepository('repository')
  if (repositoryInput) {
    repository = repositoryInput
  } else {
    repository = contextRepository
  }

  // output-to
  const outputTo = getInputChoice('output-to', 'all', ['all', 'action', 'env'])

  // env-prefix
  const envPrefix = getInputOptional('env-prefix')

  // dry-run
  const dryRun = getInputBoolean('dry-run', 'false')

  return { repository, deployEnvironment, outputTo, envPrefix, dryRun }
}
