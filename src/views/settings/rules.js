import _ from 'lodash'

const rulesForSettings = [{
  name: 'renderIfNotEqual',
  targetKey: ':proxy_remote', // check if this setting will be rendered
  targetGroup: 'Pleroma.Upload', // check if setting from this group will be rendered
  pathToSetting: [':pleroma', 'Pleroma.Upload', ':uploader'], // path to the setting whose value will be checked
  notEqual: 'Pleroma.Uploaders.Local'
}]

const rulesForGroupsOfSettings = [{
  name: 'renderGroupIfEqual',
  targetGroup: 'Pleroma.Uploaders.S3', // check if this group of settings will be rendered
  pathToSetting: [':pleroma', 'Pleroma.Upload', ':uploader'], // path to the setting whose value will be checked
  equal: 'Pleroma.Uploaders.S3'
},
{
  name: 'renderGroupIfEqual',
  targetGroup: 'Pleroma.Uploaders.Local', // check if this group of settings will be rendered
  pathToSetting: [':pleroma', 'Pleroma.Upload', ':uploader'], // path to the setting whose value will be checked
  equal: 'Pleroma.Uploaders.Local'
},
{
  name: 'renderGroupIfEqual',
  targetGroup: ':s3', // check if this group of settings will be rendered
  pathToSetting: [':pleroma', 'Pleroma.Upload', ':uploader'], // path to the setting whose value will be checked
  equal: 'Pleroma.Uploaders.S3'
}]

const renderIfNotEqual = (state, { pathToSetting, notEqual }) => {
  return _.get(state, pathToSetting) !== notEqual
}

const renderGroupIfEqual = (state, { pathToSetting, equal }) => {
  return _.get(state, pathToSetting) === equal
}

const rulesForSettingsMap = {
  renderIfNotEqual
}

const rulesForGroupsMap = {
  renderGroupIfEqual
}

export const settingFollowsRules = (settingKey, settingGroupKey, state) => {
  const rule = rulesForSettings.find(rule => rule.targetGroup === settingGroupKey && rule.targetKey === settingKey)
  if (!rule) return true

  const ruleFn = rulesForSettingsMap[rule.name]
  if (!ruleFn) return true
  return ruleFn(state, rule)
}

export const groupFollowsRules = (settingGroupKey, state) => {
  const rule = rulesForGroupsOfSettings.find(rule => rule.targetGroup === settingGroupKey)
  if (!rule) return true

  const ruleFn = rulesForGroupsMap[rule.name]
  if (!ruleFn) return true
  return ruleFn(state, rule)
}
