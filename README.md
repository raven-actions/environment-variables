# 🔠 Environment Variables Action

[![GitHub - marketplace](https://img.shields.io/badge/marketplace-environment--variables-blue?logo=github&style=flat-square)](https://github.com/marketplace/actions/environment-variables)
[![GitHub - release](https://img.shields.io/github/v/release/raven-actions/environment-variables?style=flat-square)](https://github.com/raven-actions/environment-variables/releases/latest)
[![GitHub - ci](https://img.shields.io/github/actions/workflow/status/raven-actions/environment-variables/ci.yml?logo=github&label=CI&style=flat-square&branch=main&event=push)](https://github.com/raven-actions/environment-variables/actions/workflows/ci.yml?query=branch%3Amain+event%3Apush)
[![Codecov](https://img.shields.io/codecov/c/github/raven-actions/environment-variables/main?logo=codecov&style=flat-square&token=y1vFW7kExw)](https://codecov.io/github/raven-actions/environment-variables)
[![GitHub - license](https://img.shields.io/github/license/raven-actions/environment-variables?style=flat-square)](https://github.com/raven-actions/environment-variables/blob/main/LICENSE)

---

> ⚠️ The name of the action may be confusing, and it is not related to the ordinary meaning of the `environment variables`, as we know on the OS level (after all, it can set environment variables anyway), but to variables on the [GitHub Deployment Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-variables).

One way to handle deployments is to use [Deployment Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#about-environments). However, there may be cases where Deployment Environment variables need to be used before the deployment process.

With this [GitHub Action](https://github.com/features/actions), you can access Deployment Environment variables from GitHub workflow not associated with any deployment. For example, this allows you to delay approval until after the planning stage but before applying it or any other situations where you must utilize Deployment Environment variables without proceeding with Environment deployment.

The action will fetch all variables from the Deployment Environment and set them in the workflow as action output and/or as environment variables on the OS level.

## 📑 Table of Contents <!-- omit in toc -->

- [🛠️ Usage](#️-usage)
  - [Prerequisites (permissions)](#prerequisites-permissions)
  - [Quick Start](#quick-start)
- [📥 Inputs](#-inputs)
- [📤 Outputs](#-outputs)
- [👥 Contributing](#-contributing)
- [🛡️ License](#️-license)

## 🛠️ Usage

### Prerequisites (permissions)

You cannot use the built-in GitHub Token (well-known as `${{ github.token }}` or `${{ secrets.GITHUB_TOKEN }}`) with this action because it does not support Deployment Environments read access.

You have to create a [fine-grained Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token) on the [Developer Settings](https://github.com/settings/tokens?type=beta) page, or for more scalable organization-wide scenarios, you can consider [GitHub Apps](https://docs.github.com/en/apps/overview). It has a higher rate limit than PATs but requires additional configuration steps on your GitHub workflow. Please follow the [GitHub App Setup](https://github.com/github/combine-prs/blob/main/docs/github-app-setup.md#github-app-setup) example.

No matter which way you choose the required scope for this GitHub Action is `environments:read`.

### Quick Start

The minimum required inputs are `github-token` with your GitHub Token and `environment` with the deployment environment name that you want to use to fetch variables.

The below example assumes the Deployment Environment name is `staging` and contains two variables:

- `MY_VAR1` with value `Lorem ipsum`
- `FOOBAR` with value `Abc123`

```yaml
- name: Staging Environment Variables
  id: staging-env-vars
  uses: raven-actions/environment-variables@v1
  with:
    github-token: ${{ secrets.MY_GH_TOKEN }}
    environment: staging
```

In the subsequence step, you can use variables in two ways.

1. as `action outputs`, where the output name is the variable key.

    ```yaml
    - run: |
        echo "${{ steps.staging-env-vars.outputs.MY_VAR1 }}"
        echo "${{ steps.staging-env-vars.outputs.FOOBAR }}"
    ```

1. as `environment variables`, where the env name is the variable key.

Whatever method you choose the output will be:

```text
Lorem ipsum
Abc123
```

> 💡 In some scenarios, you may use variables from multiple Deployment Environments in the same Job where the variable key is the same. To avoid override, you can prefix environment variables with the `env-prefix` input. See the [📥 Inputs](#-inputs) section for more details.

## 📥 Inputs

|      Name      |   Type   | Required | Default             | Description                                                                                                                                                                                                               |
|:--------------:|:--------:|:--------:|:--------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `github-token` | `string` |  `true`  | *not set*           | GitHub token to use for API authentication with `environment:read`. scope.                                                                                                                                                |
| `environment`  | `string` |  `true`  | *not set*           | Deployment Environment name.                                                                                                                                                                                              |
|  `output-to`   | `string` | `false`  | `all`               | Output type. One of:<br/>- `action` returns variables as action output<br/>- `env` returns variables as environment variables<br/>- `all` action output + envvars.                                                        |
|  `env-prefix`  | `string` | `false`  | *not set*           | Prefix for environment variables. Environment variables prefix will be upper-cased and striped from any special characters. A double underscore `__` is placed between environment prefix and env name (`MYPREFIX__VAR`). |
|  `repository`  | `string` | `false`  | `github.repository` | To fetch variables from Deployment Environment placed in different repository, set full repository name in the `owner/repo` format.                                                                                       |

## 📤 Outputs

- The action does not have any static action outputs. Only dynamic action output based on your variables from Deployment Environment, if `output-to` is `all` or `action`.
- The action does not have any static environment variables outputs. Only dynamic environment variables output based on your variables from Deployment Environment, if `output-to` is `all` or `env`.

## 👥 Contributing

Contributions to the project are welcome! Please follow [Contributing Guide](https://github.com/raven-actions/environment-variables/blob/main/.github/CONTRIBUTING.md).

## 🛡️ License

This project is distributed under the terms of the [MIT](https://github.com/raven-actions/environment-variables/blob/main/LICENSE) license.
