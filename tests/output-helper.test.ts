import * as utils from '../src/utils'
import { setOutputs, DeployEnvVars } from '../src/output-helper'

describe('output-helper', () => {
  const setOutputSpy = jest.spyOn(utils, 'setOutput').mockImplementation(jest.fn())
  const setEnvVarSpy = jest.spyOn(utils, 'setEnvVar').mockImplementation(jest.fn())
  const mockDeployEnvVars: DeployEnvVars = [
    { name: 'test1', value: 'test1', created_at: '2020-01-01T00:00:00Z', updated_at: '2020-01-01T00:00:00Z' },
    { name: 'test2', value: 'test2', created_at: '2020-01-01T00:00:00Z', updated_at: '2020-01-01T00:00:00Z' }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  afterEach(() => {
    // inputs = {}
  })

  it('should set only action outputs', () => {
    setOutputs(mockDeployEnvVars, 'action', '', false)
    expect(setOutputSpy).toHaveBeenCalledTimes(2)
    expect(setEnvVarSpy).toHaveBeenCalledTimes(0)
  })

  it('should set only environment variables - no prefix', () => {
    setOutputs(mockDeployEnvVars, 'env', '', false)
    expect(setOutputSpy).toHaveBeenCalledTimes(0)
    expect(setEnvVarSpy).toHaveBeenCalledTimes(2)
  })

  it('should set only environment variables - with prefix', () => {
    setOutputs(mockDeployEnvVars, 'env', 'test', false)
    expect(setOutputSpy).toHaveBeenCalledTimes(0)
    expect(setEnvVarSpy).toHaveBeenCalledTimes(2)
  })

  it('should set action outputs and environment variables', () => {
    setOutputs(mockDeployEnvVars, 'all', '', false)
    expect(setOutputSpy).toHaveBeenCalledTimes(2)
    expect(setEnvVarSpy).toHaveBeenCalledTimes(2)
  })

  it('should end log group', () => {
    const logInfoSpy = jest.spyOn(utils, 'logInfo').mockImplementation(jest.fn())

    setOutputs([], 'all', '', false)
    expect(logInfoSpy).toHaveBeenCalledTimes(1)
    expect(logInfoSpy).toHaveBeenCalledWith('No variables to set')
  })
})
