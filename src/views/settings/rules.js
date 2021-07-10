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
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_simple',
  policy: 'Pleroma.Web.ActivityPub.MRF.SimplePolicy'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_normalize_markup',
  policy: 'Pleroma.Web.ActivityPub.MRF.NormalizeMarkup'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_vocabulary',
  policy: 'Pleroma.Web.ActivityPub.MRF.VocabularyPolicy'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_hellthread',
  policy: 'Pleroma.Web.ActivityPub.MRF.HellthreadPolicy'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_keyword',
  policy: 'Pleroma.Web.ActivityPub.MRF.KeywordPolicy'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_activity_expiration',
  policy: 'Pleroma.Web.ActivityPub.MRF.ActivityExpirationPolicy'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_object_age',
  policy: 'Pleroma.Web.ActivityPub.MRF.ObjectAgePolicy'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_subchain',
  policy: 'Pleroma.Web.ActivityPub.MRF.SubchainPolicy'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_mention',
  policy: 'Pleroma.Web.ActivityPub.MRF.MentionPolicy'
},
{
  name: 'renderMrfGroup',
  targetGroup: ':mrf_rejectnonpublic',
  policy: 'Pleroma.Web.ActivityPub.MRF.RejectNonPublic'
}]

const renderIfNotEqual = (state, { pathToSetting, notEqual }) => {
  return _.get(state, pathToSetting) !== notEqual
}

const renderGroupIfEqual = (state, { pathToSetting, equal }) => {
  return _.get(state, pathToSetting) === equal
}

const renderMrfGroup = (state, { policy }) => {
  const selectedMrfPolicies = _.get(state, [':pleroma', ':mrf', ':policies']) || []

  return selectedMrfPolicies.includes(policy)
}

const rulesForSettingsMap = {
  renderIfNotEqual
}

const rulesForGroupsMap = {
  renderGroupIfEqual,
  renderMrfGroup
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
