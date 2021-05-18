import _ from 'lodash'

const settingsTypesMap = {
  AtomInput: ['atom'],
  BooleanCombinedInput: [['string', 'boolean'], ['integer', 'boolean'], ['atom', 'boolean'], ['tuple_of_three', 'boolean']],
  EditableKeywordInput: [['keyword', 'multiple_select'], ['keyword', 'string'], ['keyword', 'integer'], ['keyword', 'string', 'reversed'], ['map', 'string']],
  ImageUploadInput: [['string', 'image'], ['string', 'image', 'full_size']],
  IpInput: [['tuple', 'ip']],
  KeywordMapInput: [['keyword', 'map']],
  ListOfMapsInput: [['list', 'map']],
  MultipleSelectInput: ['multiple_select', ['multiple_select', 'tuple']],
  NumberInput: ['integer'],
  StringInput: ['string', ['string', 'atom']],
  StringOrTupleInput: [['tuple', 'string']],
  SwitchInput: ['boolean'],
  SelectInput: ['select'],
  SelectInputWithReducedLabels: [['select', 'reduced_labels'], ['multiple_select', 'reduced_labels']],
  TextareaInput: ['textarea'],
  TupleOrPairOfTuplesInput: [['tuple_of_integers', 'pair_of_tuples']]
}

export const mapSetting = (settingType) => {
  const component = _.keys(settingsTypesMap).find(component =>
    _.some(settingsTypesMap[component], type => _.isEqual(settingType, type)))
  return component
}
