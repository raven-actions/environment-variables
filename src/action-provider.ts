import { context, getOctokit as getGitHubOctokit } from '@actions/github'
import type { GitHub as GitHubOctokit } from '@actions/github/lib/utils'
import type { Context } from '@actions/github/lib/context'
import { Octokit } from 'octokit'
// import {paginateGraphql} from '@octokit/plugin-paginate-graphql'

export type { Octokit } from 'octokit'
export type { RestEndpointMethodTypes } from '@octokit/action'
export type { OctokitResponse, RequestMethod } from '@octokit/types'
export type { components as octokitComponents } from '@octokit/openapi-types'
export { RequestError } from '@octokit/request-error'

export type { Context } from '@actions/github/lib/context'

export type Repository = {
  name: string
  repo: {
    owner: string
    repo: string
  }
}

export type GitHub = {
  github: InstanceType<typeof GitHubOctokit>
  context: Context
  repository: Repository
}

export function getGitHub(token: string): GitHub {
  return {
    github: getGitHubOctokit(token),
    context,
    repository: {
      name: `${context.repo.owner}/${context.repo.repo}`,
      repo: { owner: context.repo.owner, repo: context.repo.repo }
    }
  }
}

export function getOctokit(token: string): Octokit {
  const options = {
    auth: token
  }
  return new Octokit(options)
}
