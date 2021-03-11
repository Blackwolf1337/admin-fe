const rules = [{
  name: 'renderIfNotEqual',
  key: ':proxy_remote',
  groupKey: 'Pleroma.Upload',
  group: ':pleroma',
  targetKey: ':uploader',
  targetGroup: 'Pleroma.Upload',
  notEqual: 'Pleroma.Uploaders.Local'
}]

const renderIfNotEqual = (state, { group, groupKey, targetKey, notEqual }) => {
  return state[group][groupKey][targetKey] !== notEqual
}

const rulesMap = {
  renderIfNotEqual
}

export const settingFollowsRules = (settingKey, settingGroupKey, state) => {
  const rule = rules.find(rule => rule.groupKey === settingGroupKey && rule.key === settingKey)
  if (!rule) return true

  const ruleFn = rulesMap[rule.name]
  if (!ruleFn) return true
  return ruleFn(state, rule)
}
