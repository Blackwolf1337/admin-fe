import { settingFollowsRules } from '@/views/settings/rules'

describe('Check if settings follow rules', () => {
  it('does not render :proxy_remote when local :uploader is selected', () => {
    const state = { ':pleroma': { 'Pleroma.Upload': { ':uploader': 'Pleroma.Uploaders.Local' }}}

    expect(settingFollowsRules(':proxy_remote', 'Pleroma.Upload', state)).toBeFalsy()
  })

  it('render :proxy_remote when local :uploader is not selected', () => {
    const state = { ':pleroma': { 'Pleroma.Upload': { ':uploader': 'Pleroma.Uploaders.S3' }}}

    expect(settingFollowsRules(':proxy_remote', 'Pleroma.Upload', state)).toBeTruthy()
  })

  it('render setting when there is no rule', () => {
    const state = { ':pleroma': { 'Pleroma.Upload': { ':uploader': 'Pleroma.Uploaders.Local' }}}

    expect(settingFollowsRules(':filters', 'Pleroma.Upload', state)).toBeTruthy()
  })

  it('render setting when one of the keys is undefined', () => {
    const state = { ':pleroma': {}}

    expect(settingFollowsRules(':level', undefined, state)).toBeTruthy()

    expect(settingFollowsRules(':admin_token', undefined, state)).toBeTruthy()
  })

  it('render setting when state is empty', () => {
    const state = { ':pleroma': { 'Pleroma.Upload': {}}}

    expect(settingFollowsRules(':proxy_remote', 'Pleroma.Upload', state)).toBeTruthy()
  })
})