import _ from 'lodash'

const settingsTypesMap = {
  AtomInput: ['atom'],
  EditableKeywordInput: [['keyword', ['list', 'string']]],
  // KeywordInput: ['keyword'],
  MultipleSelectInput: [['list', 'string']],
  NumberInput: ['integer'],
  StringInput: ['string', ['string', 'atom']],
  // SelectOfStringsOrTuples: [['select', ['string', 'tuple']]],
  SwitchInput: ['boolean'],
  SelectInputWithReducedLabels: [['select', 'reduced_labels'], ['multiple_select', 'reduced_labels']]
}

export const mapSetting = (settingType) => {
  const component = _.keys(settingsTypesMap).find(component =>
    _.some(settingsTypesMap[component], type => _.isEqual(settingType, type)))
  return component
}
