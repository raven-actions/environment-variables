import * as core from '@actions/core'

// re-export core module to avoid importing it in every file to use core if needed and utils not applicable
export * as core from '@actions/core'

// eslint-disable-next-line no-shadow
export enum Color {
  Red = '\x1b[31m',
  Green = '\x1b[32m',
  Yellow = '\x1b[33m',
  Blue = '\x1b[34m',
  Magenta = '\x1b[35m',
  Cyan = '\x1b[36m',
  White = '\x1b[37m',
  Reset = '\x1b[0m'
}

// eslint-disable-next-line no-shadow
export enum Emoji {
  Group = '⬇️',
  Stop = '🛑',
  Warning = '⚠️',
  Error = '❌',
  Ok = '✅',
  Info = '➡️',
  Debug = '⚙️'
}

// FORMAT
export function formatLog(message: string, color: Color, emoji: Emoji, group = false): string {
  const expand = group ? ' expand for details...' : ''
  return `${color}${emoji} ${message.trim()}${Color.Reset}${expand}`
}

// LOG
export function logOk(message: string): void {
  core.info(formatLog(message, Color.Green, Emoji.Ok))
}

export function logInfo(message: string): void {
  core.info(formatLog(message, Color.Blue, Emoji.Info))
}

export function logWarning(message: string): void {
  core.warning(formatLog(message, Color.Yellow, Emoji.Warning))
}

export function logError(message: string): void {
  core.error(formatLog(message, Color.Red, Emoji.Error))
}

export function logDebug(message: string): void {
  core.debug(formatLog(message, Color.White, Emoji.Debug))
}

export function logGroupStart(name: string, color = Color.Blue, emoji = Emoji.Group): void {
  logDebug(`Start '${name}' log group`)
  core.startGroup(formatLog(name, color, emoji, true))
}

export function logGroupEnd(name: string): void {
  core.endGroup()
  logDebug(`End '${name}' log group`)
}

// TODO: tests
export async function logGroup<T>(
  name: string,
  fn: () => Promise<T>,
  color = Color.Blue,
  emoji = Emoji.Group
): Promise<T> {
  logGroupStart(name, color, emoji)
  let result: T
  try {
    result = await fn()
  } finally {
    logGroupEnd(name)
  }
  return result
}

// EXIT
export function setFailed(message: string | Error): void {
  if (message instanceof Error) {
    message = message.message
  }
  core.setFailed(formatLog(message, Color.Red, Emoji.Stop))
}

export function exitFailure(): void {
  process.exit(core.ExitCode.Failure)
}

export function exitSuccess(): void {
  process.exit(core.ExitCode.Success)
}

// INPUTS
export function getInputChoice(key: string, defaultChoice: string, choices: string[]): string {
  const result = getInputOptional(key, defaultChoice).toLowerCase()
  if (!choices.includes(result))
    throw new Error(`'${result}' is not available option for '${key}', possible options: ${choices.join(', ')}`)
  return result
}

export function getInputRequired(key: string, defaultValue = ''): string {
  const result = getInputOptional(key, defaultValue)
  if (result === '') throw new Error(`'${key}' input required and not supplied or empty`)
  return result
}

export function getInputRepository(
  key: string,
  defaultValue = ''
): { name: string; repo: { owner: string; repo: string } } | undefined {
  const result = getInputOptional(key, defaultValue)
  let repository: { name: string; repo: { owner: string; repo: string } } | undefined
  if (result) {
    if (!/^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+$/.test(result)) {
      throw new Error(`Invalid repository format, provided: '${result}', expected: {owner}/{repo}`)
    }
    const [owner, repo] = result.split('/')
    repository = { name: result, repo: { owner, repo } }
  }
  return repository
}

export function getInputOptional(key: string, defaultValue = ''): string {
  return (
    core.getInput(key, { required: false }) || core.getInput(key.replace('-', '_'), { required: false }) || defaultValue
  )
}

// core.getBooleanInput is not handling default from code, so let's use own
export function getInputBoolean(key: string, defaultValue = 'false'): boolean {
  const trueValue = ['true', 'True', 'TRUE']
  const falseValue = ['false', 'False', 'FALSE']
  const result = getInputOptional(key, defaultValue)
  if (trueValue.includes(result)) return true
  if (falseValue.includes(result)) return false
  throw new TypeError(
    `Input does not meet YAML 1.2 "Core Schema" specification: ${key}\nSupport boolean input list: 'true | True | TRUE | false | False | FALSE'`
  )
}

// OUTPUTS
export function setOutput(key: string, value: string, secret = false, dryRun = false): void {
  let secretLog = ''
  if (secret) {
    core.setSecret(value)
    secretLog = 'secret '
  }
  logInfo(`Setting ${secretLog}'${key}' action output`)
  if (!dryRun) core.setOutput(key, value)
}

// ENVS
export function setEnvVar(key: string, value: string, envPrefix = '', secret = false, dryRun = false): void {
  envPrefix = envPrefix !== '' ? `${envPrefix.replace(/[^a-z0-9]/gi, '')}__` : ''
  const envKey = `${envPrefix}${key}`.toUpperCase()
  let secretLog = ''
  if (secret) {
    core.setSecret(value)
    secretLog = 'secret '
  }
  logInfo(`Setting ${secretLog}'${envKey}' environment variable`)
  if (!dryRun) core.exportVariable(envKey, value)
}
