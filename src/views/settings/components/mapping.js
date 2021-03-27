import _ from 'lodash'

const settingsTypesMap = {
  AtomInput: ['atom'],
  EditableKeywordInput: [['keyword', ['list', 'string']]],
  ImageUploadInput: [['string', 'image'], ['string', 'image', 'full_size']],
  IpInput: [['tuple', 'ip']],
  KeywordMapInput: [['keyword', 'map']],
  MultipleSelectInput: [['list', 'string']],
  NumberInput: ['integer'],
  StringInput: ['string', ['string', 'atom']],
  StringOrTupleInput: [['string', 'tuple']],
  // SelectOfStringsOrTuples: [['select', ['string', 'tuple']]],
  SwitchInput: ['boolean'],
  SelectInput: ['select'],
  SelectInputWithReducedLabels: [['select', 'reduced_labels'], ['multiple_select', 'reduced_labels']]
}

export const mapSetting = (settingType) => {
  const component = _.keys(settingsTypesMap).find(component =>
    _.some(settingsTypesMap[component], type => _.isEqual(settingType, type)))
  return component
}
