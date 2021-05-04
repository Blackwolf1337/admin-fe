import _ from 'lodash'

const valueMap = (key, type, parent, groupType, settingData, data) => {
  return [
    { condition: _.isEqual(groupType, ['group', 'without_key']) && settingData &&
        type === 'atom' && settingData.value[0] === ':',
    value: () => settingData.value.substr(1) },
    { condition: _.isEqual(groupType, ['group', 'without_key']) && settingData,
      value: () => settingData.value },
    { condition: _.isEqual(groupType, ['group', 'without_key']) && parent && parent.type === 'map',
      value: () => data.value[key] || [] },
    { condition: type === 'atom',
      value: () => settingData && settingData[0] === ':' ? settingData.substr(1) : settingData },
    { condition: _.isEqual(groupType, ['group', 'without_key', 'single_setting']),
      value: () => data.value },
    { condition: true,
      value: () => settingData }
  ]
}

export default valueMap
