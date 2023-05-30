import {setEnvVar, setOutput, logGroupStart, logGroupEnd, logInfo} from './utils'
import {RestEndpointMethodTypes} from './github-provider'

export type DeployEnvVars = RestEndpointMethodTypes['actions']['listEnvironmentVariables']['response']['data']['variables']

export function setOutputs(deployEnvVars: DeployEnvVars, outputTo: string, envPrefix: string): void {
  if (deployEnvVars.length > 0) {
    const logGroupName = 'Setting outputs'
    logGroupStart(logGroupName)
    if (outputTo === 'action') {
      for (const deployEnvVar of deployEnvVars) {
        setOutput(deployEnvVar.name, deployEnvVar.value)
      }
    } else if (outputTo === 'env') {
      for (const deployEnvVar of deployEnvVars) {
        setEnvVar(deployEnvVar.name, deployEnvVar.value, envPrefix)
      }
    } else {
      for (const deployEnvVar of deployEnvVars) {
        setOutput(deployEnvVar.name, deployEnvVar.value)
        setEnvVar(deployEnvVar.name, deployEnvVar.value, envPrefix)
      }
    }
    logGroupEnd(logGroupName)
  } else {
    logInfo('No variables to set')
  }
}
