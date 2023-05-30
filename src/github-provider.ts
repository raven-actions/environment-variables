import * as github from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'
import {Context} from '@actions/github/lib/context'
import {Octokit} from '@octokit/rest'
import {OctokitOptions} from '@octokit/core/dist-types/types.d'
import {restEndpointMethods} from '@octokit/plugin-rest-endpoint-methods'
import {throttling} from '@octokit/plugin-throttling'
import {retry} from '@octokit/plugin-retry'
import {paginateRest} from '@octokit/plugin-paginate-rest'
import {paginateGraphql} from '@octokit/plugin-paginate-graphql'

export {Context} from '@actions/github/lib/context'
export {RequestError} from '@octokit/request-error'
export type {Octokit} from '@octokit/rest'
export type {OctokitResponse, RequestMethod} from '@octokit/types'
export type {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods'

export type Repo = {
  name: string
  repo: {
    owner: string
    repo: string
  }
}

export function getGitHub(token: string): {github: InstanceType<typeof GitHub>; context: Context; repo: Repo} {
  const GitHubOctokit = github.getOctokit(token)
  const {context} = github
  return {github: GitHubOctokit, context, repo: {name: `${context.repo.owner}/${context.repo.repo}`, repo: {owner: context.repo.owner, repo: context.repo.repo}}}
}

export function getOctokit(token: string): InstanceType<typeof MyOctokit> {
  const octokitOptions: OctokitOptions = {
    auth: token,
    throttle: {
      onRateLimit: (retryAfter, options: OctokitOptions, octokit, retryCount) => {
        octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`)

        if (retryCount < 1) {
          // only retries once
          octokit.log.info(`Retrying after ${retryAfter} seconds!`)
          return true
        }
      },
      onSecondaryRateLimit: (retryAfter, options: OctokitOptions, octokit) => {
        // does not retry, only logs a warning
        octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`)
      }
    }
  }

  const MyOctokit = Octokit.plugin(throttling).plugin(restEndpointMethods).plugin(retry).plugin(paginateRest).plugin(paginateGraphql).defaults(octokitOptions)
  return new MyOctokit()
}
