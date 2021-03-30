import _ from 'lodash'

const settingsTypesMap = {
  AtomInput: ['atom'],
  BooleanCombinedInput: [['string', 'boolean'], ['integer', 'boolean'], ['atom', 'boolean'], ['tuple', 'boolean']],
  EditableKeywordInput: [['keyword', ['list', 'string']]],
  ImageUploadInput: [['string', 'image'], ['string', 'image', 'full_size']],
  IpInput: [['tuple', 'ip']],
  KeywordMapInput: [['keyword', 'map']],
  ListOfMapsInput: [['list', 'map']],
  MultipleSelectInput: [['list', 'string'], ['list', 'atom']],
  NumberInput: ['integer'],
  StringOrTupleMultipleSelect: [['select', ['string', 'tuple']]],
  StringInput: ['string', ['string', 'atom']],
  StringOrTupleInput: [['string', 'tuple']],
  SwitchInput: ['boolean'],
  SelectInput: ['select'],
  SelectInputWithReducedLabels: [['select', 'reduced_labels'], ['multiple_select', 'reduced_labels']],
  TextareaInput: ['textarea']
}

export const mapSetting = (settingType) => {
  const component = _.keys(settingsTypesMap).find(component =>
    _.some(settingsTypesMap[component], type => _.isEqual(settingType, type)))
  return component
}
