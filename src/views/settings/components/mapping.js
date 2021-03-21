import _ from 'lodash'

const settingsTypesMap = [
  { NumberInput: 'integer' },
  { SelectOfStringsOrTuples: ['select', ['string', 'tuple']] },
  { SwitchInput: 'boolean' }
]

export const mapSetting = (type) => {
  const component = settingsTypesMap.find(mapObject => _.isEqual(type, _.values(mapObject)[0]))
  console.log(_.keys(component)[0])
  return _.keys(component)[0]
}
