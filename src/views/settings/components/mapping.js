import _ from 'lodash'

const settingsTypesMap = {
  StringInput: ['string', ['string', 'atom']],
  NumberInput: ['integer'],
  SelectOfStringsOrTuples: [['select', ['string', 'tuple']]],
  SwitchInput: ['boolean'],
  SelectInputWithReducedLabels: [['select', 'reduced_labels'], ['multiple_select', 'reduced_labels']]
}

export const mapSetting = (settingType) => {
  const component = _.keys(settingsTypesMap).find(component =>
    _.some(settingsTypesMap[component], type => _.isEqual(settingType, type)))
  return component
}
