import { jest } from '@jest/globals'
import * as utils from '../src/utils.ts'

describe('utils', () => {
  let mockInputs = {} as any
  jest.spyOn(utils.core, 'getInput').mockImplementation((name: string) => {
    return mockInputs[name]
  })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  afterEach(() => {
    mockInputs = {}
  })

  // FORMAT
  it('should return formatted log', () => {
    const repo = utils.formatLog('test', utils.Color.Blue, utils.Emoji.Info)
    expect(repo).toEqual(`${utils.Color.Blue}${utils.Emoji.Info} test${utils.Color.Reset}`)
  })

  it('should return formatted log for group', () => {
    const repo = utils.formatLog('test', utils.Color.Blue, utils.Emoji.Group, true)
    expect(repo).toEqual(`${utils.Color.Blue}${utils.Emoji.Group} test${utils.Color.Reset} expand for details...`)
  })

  // LOG
  it('should log OK', () => {
    jest.spyOn(utils.core, 'info').mockImplementation(jest.fn())
    utils.logOk('test')
    expect(utils.core.info).toHaveBeenCalledWith(`${utils.Color.Green}${utils.Emoji.Ok} test${utils.Color.Reset}`)
  })

  it('should log INFO', () => {
    jest.spyOn(utils.core, 'info').mockImplementation(jest.fn())
    utils.logInfo('test')
    expect(utils.core.info).toHaveBeenCalledWith(`${utils.Color.Blue}${utils.Emoji.Info} test${utils.Color.Reset}`)
  })

  it('should log WARNING', () => {
    jest.spyOn(utils.core, 'warning').mockImplementation(jest.fn())
    utils.logWarning('test')
    expect(utils.core.warning).toHaveBeenCalledWith(
      `${utils.Color.Yellow}${utils.Emoji.Warning} test${utils.Color.Reset}`
    )
  })

  it('should log ERROR', () => {
    jest.spyOn(utils.core, 'error').mockImplementation(jest.fn())
    utils.logError('test')
    expect(utils.core.error).toHaveBeenCalledWith(`${utils.Color.Red}${utils.Emoji.Error} test${utils.Color.Reset}`)
  })

  it('should log DEBUG', () => {
    jest.spyOn(utils.core, 'debug').mockImplementation(jest.fn())
    utils.logDebug('test')
    expect(utils.core.debug).toHaveBeenCalledWith(`${utils.Color.White}${utils.Emoji.Debug} test${utils.Color.Reset}`)
  })

  it('should start log group', () => {
    jest.spyOn(utils.core, 'startGroup').mockImplementation(jest.fn())
    utils.logGroupStart('test')
    expect(utils.core.startGroup).toHaveBeenCalledWith(
      `${utils.Color.Blue}${utils.Emoji.Group} test${utils.Color.Reset} expand for details...`
    )
  })

  it('should end log group', () => {
    jest.spyOn(utils.core, 'endGroup').mockImplementation(jest.fn())
    utils.logGroupEnd('test')
    expect(utils.core.endGroup).toHaveBeenCalledTimes(1)
    expect(utils.core.endGroup).toHaveBeenCalledWith()
  })

  it('should star/end log group', async () => {
    // jest.spyOn(utils, 'logGroupStart').mockImplementation(jest.fn())
    // jest.spyOn(utils, 'logGroupEnd').mockImplementation(jest.fn())
    await expect(
      utils.logGroup('Test', async () => {
        return
      })
    ).resolves.toBeUndefined()
  })

  // EXIT
  it('should set failed - string', () => {
    jest.spyOn(utils.core, 'setFailed').mockImplementation(jest.fn())
    utils.setFailed('test')
    expect(utils.core.setFailed).toHaveBeenCalledWith(`${utils.Color.Red}${utils.Emoji.Stop} test${utils.Color.Reset}`)
  })

  it('should set failed - error', () => {
    jest.spyOn(utils.core, 'setFailed').mockImplementation(jest.fn())
    utils.setFailed(new Error('test'))
    expect(utils.core.setFailed).toHaveBeenCalledWith(`${utils.Color.Red}${utils.Emoji.Stop} test${utils.Color.Reset}`)
  })

  it('should exit failure', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => {
      throw new Error(`process.exit called with "${number}"`)
    })
    expect(() => {
      utils.exitFailure()
    }).toThrow('process.exit called with "1"')
    expect(mockExit).toHaveBeenCalledWith(utils.core.ExitCode.Failure)
  })

  it('should exit success', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => {
      throw new Error(`process.exit called with "${number}"`)
    })
    expect(() => {
      utils.exitSuccess()
    }).toThrow('process.exit called with "0"')
    expect(mockExit).toHaveBeenCalledWith(utils.core.ExitCode.Success)
  })

  // INPUTS
  it('should get input choice - input supplied', () => {
    mockInputs = { test: 'foo' }
    expect(utils.getInputChoice('test', 'bar', ['foo', 'bar'])).toEqual('foo')
  })

  it('should get input choice - default', () => {
    expect(utils.getInputChoice('test', 'bar', ['foo', 'bar'])).toEqual('bar')
  })

  it('should get input choice - input invalid', () => {
    mockInputs = { test: 'invalid' }
    expect(() => {
      utils.getInputChoice('test', 'bar', ['foo', 'bar'])
    }).toThrow(`'invalid' is not available option for 'test', possible options: foo, bar`)
  })

  it('should get required input - input supplied', () => {
    mockInputs = { test: 'foo' }
    expect(utils.getInputRequired('test')).toEqual('foo')
  })

  it('should throw an error when required input not supplied', () => {
    expect(() => {
      utils.getInputRequired('test')
    }).toThrow(`'test' input required and not supplied or empty`)
  })

  it('should get optional input - input supplied', () => {
    mockInputs = { test: 'foo' }
    expect(utils.getInputOptional('test')).toEqual('foo')
  })

  it('should get empty optional input - input not supplied', () => {
    expect(utils.getInputOptional('test')).toEqual('')
  })

  it('should get optional input - default supplied', () => {
    expect(utils.getInputOptional('test', 'foo')).toEqual('foo')
  })

  it('should get boolean input - true', () => {
    mockInputs = { test: 'true' }
    expect(utils.getInputBoolean('test')).toEqual(true)
  })

  it('should get boolean input - false', () => {
    mockInputs = { test: 'false' }
    expect(utils.getInputBoolean('test')).toEqual(false)
  })

  it('should get boolean input - default (false)', () => {
    expect(utils.getInputBoolean('test')).toEqual(false)
  })

  it('should get boolean input - invalid', () => {
    mockInputs = { test: 'invalid' }
    expect(() => {
      utils.getInputBoolean('test')
    }).toThrow(/Input does not meet YAML 1.2 "Core Schema" specification/)
  })

  // getInputRepository
  it('should get repository input - input supplied', () => {
    mockInputs = { test: 'test/test' }
    expect(utils.getInputRepository('test')).toEqual({
      name: 'test/test',
      repo: { owner: 'test', repo: 'test' }
    })
  })

  it('should throw an error when repository has invalid format', () => {
    mockInputs = { test: 'invalid' }
    expect(() => {
      utils.getInputRepository('test')
    }).toThrow(`Invalid repository format, provided: 'invalid', expected: {owner}/{repo}`)
  })

  it('should get undefined repository', () => {
    expect(utils.getInputRepository('test')).toBeUndefined()
  })

  // OUTPUTS
  it('should set output', () => {
    jest.spyOn(utils.core, 'setOutput').mockImplementation(jest.fn())
    utils.setOutput('test', 'foo')
    expect(utils.core.setOutput).toHaveBeenCalledWith('test', 'foo')
  })

  it('should set secret output', () => {
    jest.spyOn(utils.core, 'setOutput').mockImplementation(jest.fn())
    jest.spyOn(utils.core, 'setSecret').mockImplementation(jest.fn())
    utils.setOutput('test', 'foo', true)
    expect(utils.core.setSecret).toHaveBeenCalledWith('foo')
    expect(utils.core.setOutput).toHaveBeenCalledWith('test', 'foo')
  })

  it('should not set output - dry-run', () => {
    jest.spyOn(utils.core, 'setOutput').mockImplementation(jest.fn())
    utils.setOutput('test', 'foo', false, true)
    expect(utils.core.setOutput).toHaveBeenCalledTimes(0)
  })

  // ENV
  it('should set env var - no prefix', () => {
    jest.spyOn(utils.core, 'exportVariable').mockImplementation(jest.fn())
    utils.setEnvVar('test', 'foo')
    expect(utils.core.exportVariable).toHaveBeenCalledWith('TEST', 'foo')
  })

  it('should set env var - with prefix', () => {
    jest.spyOn(utils.core, 'exportVariable').mockImplementation(jest.fn())
    utils.setEnvVar('test', 'foo', 'bar')
    expect(utils.core.exportVariable).toHaveBeenCalledWith('BAR__TEST', 'foo')
  })

  it('should set secret env var', () => {
    jest.spyOn(utils.core, 'exportVariable').mockImplementation(jest.fn())
    jest.spyOn(utils.core, 'setSecret').mockImplementation(jest.fn())
    utils.setEnvVar('test', 'foo', '', true)
    expect(utils.core.setSecret).toHaveBeenCalledWith('foo')
    expect(utils.core.exportVariable).toHaveBeenCalledWith('TEST', 'foo')
  })

  it('should not set env var - dry-run', () => {
    jest.spyOn(utils.core, 'exportVariable').mockImplementation(jest.fn())
    utils.setEnvVar('test', 'foo', '', false, true)
    expect(utils.core.exportVariable).toHaveBeenCalledTimes(0)
  })
})
