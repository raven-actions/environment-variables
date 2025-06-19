import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as utils from '../src/utils.ts'

describe('utils', () => {
  let mockInputs = {} as any
  vi.spyOn(utils.core, 'getInput').mockImplementation((name: string) => {
    return mockInputs[name]
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
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
    vi.spyOn(utils.core, 'info').mockImplementation(vi.fn())
    utils.logOk('test')
    expect(utils.core.info).toHaveBeenCalledWith(`${utils.Color.Green}${utils.Emoji.Ok} test${utils.Color.Reset}`)
  })

  it('should log INFO', () => {
    vi.spyOn(utils.core, 'info').mockImplementation(vi.fn())
    utils.logInfo('test')
    expect(utils.core.info).toHaveBeenCalledWith(`${utils.Color.Blue}${utils.Emoji.Info} test${utils.Color.Reset}`)
  })

  it('should log WARNING', () => {
    vi.spyOn(utils.core, 'warning').mockImplementation(vi.fn())
    utils.logWarning('test')
    expect(utils.core.warning).toHaveBeenCalledWith(
      `${utils.Color.Yellow}${utils.Emoji.Warning} test${utils.Color.Reset}`
    )
  })

  it('should log ERROR', () => {
    vi.spyOn(utils.core, 'error').mockImplementation(vi.fn())
    utils.logError('test')
    expect(utils.core.error).toHaveBeenCalledWith(`${utils.Color.Red}${utils.Emoji.Error} test${utils.Color.Reset}`)
  })

  it('should log DEBUG', () => {
    vi.spyOn(utils.core, 'debug').mockImplementation(vi.fn())
    utils.logDebug('test')
    expect(utils.core.debug).toHaveBeenCalledWith(`${utils.Color.White}${utils.Emoji.Debug} test${utils.Color.Reset}`)
  })

  it('should start log group', () => {
    vi.spyOn(utils.core, 'startGroup').mockImplementation(vi.fn())
    utils.logGroupStart('test')
    expect(utils.core.startGroup).toHaveBeenCalledWith(
      `${utils.Color.Blue}${utils.Emoji.Group} test${utils.Color.Reset} expand for details...`
    )
  })

  it('should end log group', () => {
    vi.spyOn(utils.core, 'endGroup').mockImplementation(vi.fn())
    utils.logGroupEnd('test')
    expect(utils.core.endGroup).toHaveBeenCalledTimes(1)
    expect(utils.core.endGroup).toHaveBeenCalledWith()
  })

  it('should star/end log group', async () => {
    // vi.spyOn(utils, 'logGroupStart').mockImplementation(vi.fn())
    // vi.spyOn(utils, 'logGroupEnd').mockImplementation(vi.fn())
    await expect(
      utils.logGroup('Test', async () => {
        return
      })
    ).resolves.toBeUndefined()
  })

  // EXIT
  it('should set failed - string', () => {
    vi.spyOn(utils.core, 'setFailed').mockImplementation(vi.fn())
    utils.setFailed('test')
    expect(utils.core.setFailed).toHaveBeenCalledWith(`${utils.Color.Red}${utils.Emoji.Stop} test${utils.Color.Reset}`)
  })

  it('should set failed - error', () => {
    vi.spyOn(utils.core, 'setFailed').mockImplementation(vi.fn())
    utils.setFailed(new Error('test'))
    expect(utils.core.setFailed).toHaveBeenCalledWith(`${utils.Color.Red}${utils.Emoji.Stop} test${utils.Color.Reset}`)
  })

  it('should exit failure', () => {
    const mockExit = vi.spyOn(process, 'exit').mockImplementation((number) => {
      throw new Error(`process.exit called with "${number}"`)
    })
    expect(() => {
      utils.exitFailure()
    }).toThrow('process.exit called with "1"')
    expect(mockExit).toHaveBeenCalledWith(utils.core.ExitCode.Failure)
  })

  it('should exit success', () => {
    const mockExit = vi.spyOn(process, 'exit').mockImplementation((number) => {
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
    vi.spyOn(utils.core, 'setOutput').mockImplementation(vi.fn())
    utils.setOutput('test', 'foo')
    expect(utils.core.setOutput).toHaveBeenCalledWith('test', 'foo')
  })

  it('should set secret output', () => {
    vi.spyOn(utils.core, 'setOutput').mockImplementation(vi.fn())
    vi.spyOn(utils.core, 'setSecret').mockImplementation(vi.fn())
    utils.setOutput('test', 'foo', true)
    expect(utils.core.setSecret).toHaveBeenCalledWith('foo')
    expect(utils.core.setOutput).toHaveBeenCalledWith('test', 'foo')
  })

  it('should not set output - dry-run', () => {
    vi.spyOn(utils.core, 'setOutput').mockImplementation(vi.fn())
    utils.setOutput('test', 'foo', false, true)
    expect(utils.core.setOutput).toHaveBeenCalledTimes(0)
  })

  // ENV
  it('should set env var - no prefix', () => {
    vi.spyOn(utils.core, 'exportVariable').mockImplementation(vi.fn())
    utils.setEnvVar('test', 'foo')
    expect(utils.core.exportVariable).toHaveBeenCalledWith('TEST', 'foo')
  })

  it('should set env var - with prefix', () => {
    vi.spyOn(utils.core, 'exportVariable').mockImplementation(vi.fn())
    utils.setEnvVar('test', 'foo', 'bar')
    expect(utils.core.exportVariable).toHaveBeenCalledWith('BAR__TEST', 'foo')
  })

  it('should set secret env var', () => {
    vi.spyOn(utils.core, 'exportVariable').mockImplementation(vi.fn())
    vi.spyOn(utils.core, 'setSecret').mockImplementation(vi.fn())
    utils.setEnvVar('test', 'foo', '', true)
    expect(utils.core.setSecret).toHaveBeenCalledWith('foo')
    expect(utils.core.exportVariable).toHaveBeenCalledWith('TEST', 'foo')
  })

  it('should not set env var - dry-run', () => {
    vi.spyOn(utils.core, 'exportVariable').mockImplementation(vi.fn())
    utils.setEnvVar('test', 'foo', '', false, true)
    expect(utils.core.exportVariable).toHaveBeenCalledTimes(0)
  })
})
