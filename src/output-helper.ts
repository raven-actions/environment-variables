import { setEnvVar, setOutput, logGroupStart, logGroupEnd, logInfo } from './utils.js'
import { RestEndpointMethodTypes } from './action-provider.js'

export type DeployEnvVars =
  RestEndpointMethodTypes['actions']['listEnvironmentVariables']['response']['data']['variables']

export function setOutputs(deployEnvVars: DeployEnvVars, outputTo: string, envPrefix: string, dryRun: boolean): void {
  if (deployEnvVars.length > 0) {
    const logGroupName = 'Setting outputs'
    logGroupStart(logGroupName)
    if (outputTo === 'action') {
      for (const deployEnvVar of deployEnvVars) {
        setOutput(deployEnvVar.name, deployEnvVar.value, false, dryRun)
      }
    } else if (outputTo === 'env') {
      for (const deployEnvVar of deployEnvVars) {
        setEnvVar(deployEnvVar.name, deployEnvVar.value, envPrefix, false, dryRun)
      }
    } else {
      for (const deployEnvVar of deployEnvVars) {
        setOutput(deployEnvVar.name, deployEnvVar.value, false, dryRun)
        setEnvVar(deployEnvVar.name, deployEnvVar.value, envPrefix, false, dryRun)
      }
    }
    logGroupEnd(logGroupName)
  } else {
    logInfo('No variables to set')
  }
}
