import path from 'path'

function getDefaultValues(): object {
  return {}
}
Object.assign(
  process.env,
  {
    GITHUB_ACTION: 'test-action',
    GITHUB_ACTOR: 'raven-actions',
    GITHUB_REF: 'main',
    GITHUB_REPOSITORY: 'raven-actions/test',
    GITHUB_SHA: '123abc',
    GITHUB_TOKEN: '456def',
    GITHUB_WORKFLOW: 'test-workflow',
    GITHUB_WORKSPACE: path.resolve(__dirname, 'fixtures', 'workspace')
  },
  getDefaultValues()
)
