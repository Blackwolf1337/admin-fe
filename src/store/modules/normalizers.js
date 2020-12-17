import _ from 'lodash'

export const getBooleanValue = value => {
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  }
  return value
}

const getCurrentValue = (type, settings, path) => {
  if (type === 'state') {
    return _.get(settings, path)
  } else {
    const [firstSettingName, ...restKeys] = path
    const firstSegment = settings[firstSettingName]
    if (restKeys.length === 0 || !firstSegment) {
      return firstSegment || false
    } else {
      const secondSegment = (settings, keys) => {
        const [element, ...rest] = keys
        return keys.length === 0 ? settings : secondSegment(settings[1][element], rest)
      }
      return secondSegment(firstSegment, restKeys)
    }
  }
}

export const parseNonTuples = (key, value) => {
  if (key === ':backends') {
    const index = value.findIndex(el => typeof el === 'object' && el.tuple.includes(':ex_syslogger'))
    const updated = value.map((el, i) => i === index ? ':ex_syslogger' : el)
    return updated
  }
  if (key === ':args') {
    return typeof value === 'string' ? [value] : value
  }
  return value
}
// REFACTOR
export const parseTuples = (tuples, key) => {
  return tuples.reduce((accum, item) => {
    if (key === ':rate_limit' ||
      (key === 'Pleroma.Web.Endpoint.MetricsExporter' && item.tuple[0] === ':auth')) {
      const getValue = () => {
        if (typeof item.tuple[1] === 'boolean') {
          return item.tuple[1]
        } else if (Array.isArray(item.tuple[1])) {
          return item.tuple[1].map(el => el.tuple)
        } else {
          return item.tuple[1].tuple
        }
      }
      accum[item.tuple[0]] = getValue()
    } else if (item.tuple[0] === ':mascots') {
      accum[item.tuple[0]] = item.tuple[1].reduce((acc, mascot) => {
        return [...acc, { [mascot.tuple[0]]: { ...mascot.tuple[1], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }}]
      }, [])
    } else if (Array.isArray(item.tuple[1]) &&
      (item.tuple[0] === ':groups' ||
      item.tuple[0] === ':replace' ||
      item.tuple[0] === ':retries' ||
      (item.tuple[0] === ':headers' && key === 'Pleroma.Web.MediaProxy.Invalidation.Http') ||
      item.tuple[0] === ':crontab')) {
      if (item.tuple[0] === ':crontab') {
        accum[item.tuple[0]] = item.tuple[1].reduce((acc, group) => {
          return [...acc, { [group.tuple[1]]: { value: group.tuple[0], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }}]
        }, [])
      } else {
        accum[item.tuple[0]] = item.tuple[1].reduce((acc, group) => {
          return [...acc, { [group.tuple[0]]: { value: group.tuple[1], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }}]
        }, [])
      }
    } else if (item.tuple[0] === ':icons') {
      accum[item.tuple[0]] = item.tuple[1].map(icon => {
        return Object.keys(icon).map(name => {
          return { key: name, value: icon[name], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }
        })
      }, [])
    } else if (item.tuple[0] === ':proxy_url' || item.tuple[0] === ':sender') {
      accum[item.tuple[0]] = parseStringOrTupleValue(item.tuple[0], item.tuple[1])
    } else if (item.tuple[0] === ':args' || item.tuple[0] === ':backends') {
      accum[item.tuple[0]] = parseNonTuples(item.tuple[0], item.tuple[1])
    } else if (item.tuple[0] === ':ip_whitelist') {
      accum[item.tuple[0]] = item.tuple[1].map(ip => typeof ip === 'string' ? ip : ip.tuple.join('.'))
    } else if (Array.isArray(item.tuple[1]) &&
      (typeof item.tuple[1][0] === 'object' && !Array.isArray(item.tuple[1][0])) && item.tuple[1][0]['tuple']) {
      accum[item.tuple[0]] = parseTuples(item.tuple[1], item.tuple[0])
    } else if (Array.isArray(item.tuple[1])) {
      accum[item.tuple[0]] = item.tuple[1]
    } else if (item.tuple[0] === ':ip') {
      accum[item.tuple[0]] = item.tuple[1].tuple.join('.')
    } else if (item.tuple[1] && typeof item.tuple[1] === 'object') {
      if (item.tuple[0] === ':params' || item.tuple[0] === ':match_actor') {
        accum[item.tuple[0]] = Object.keys(item.tuple[1]).reduce((acc, key) => {
          return [...acc, { [key]: { value: item.tuple[1][key], id: `f${(~~(Math.random() * 1e8)).toString(16)}` }}]
        }, [])
      } else {
        accum[item.tuple[0]] = parseObject(item.tuple[1])
      }
    } else {
      accum[item.tuple[0]] = item.tuple[1]
    }
    return accum
  }, {})
}

const parseObject = object => {
  return Object.keys(object).reduce((acc, item) => {
    acc[item] = object[item]
    return acc
  }, {})
}

const parseStringOrTupleValue = (key, value) => {
  if (key === ':proxy_url') {
    if (value && !Array.isArray(value) &&
      typeof value === 'object' &&
      value.tuple.length === 3 &&
      value.tuple[0] === ':socks5') {
      const [, host, port] = value.tuple
      return { socks5: true, host, port }
    } else if (typeof value === 'string') {
      const [host, port] = value.split(':')
      return { socks5: false, host, port }
    }
    return { socks5: false, host: null, port: null }
  } else if (key === ':sender') {
    if (typeof value === 'string') {
      return { email: value }
    } else if (value &&
      typeof value === 'object' &&
      value.tuple.length === 2) {
      const [nickname, email] = value.tuple
      return { nickname, email }
    }
  }
}

const prependWithСolon = (type, value) => {
  return (type === 'atom' && value.length > 0) ||
    (Array.isArray(type) && type.includes('boolean') && type.includes('atom') && typeof value === 'string')
}

export const processNested = (valueForState, valueForUpdatedSettings, group, parentKey, parents, settings, updatedSettings) => {
  const [{ key, type }, ...otherParents] = parents
  const path = [group, parentKey, ...parents.reverse().map(parent => parent.key).slice(0, -1)]

  let updatedValueForState = valueExists('state', settings, path)
    ? { ...getCurrentValue('state', settings[group][parentKey], parents.map(el => el.key).slice(0, -1)),
      ...{ [key]: valueForState }}
    : { [key]: valueForState }
  let updatedValueForUpdatedSettings = valueExists('updatedSettings', updatedSettings, path)
    ? { ...getCurrentValue('updatedSettings', updatedSettings[group][parentKey], parents.map(el => el.key).slice(0, -1))[1],
      ...{ [key]: [type, valueForUpdatedSettings] }}
    : { [key]: [type, valueForUpdatedSettings] }

  if (group === ':mime' && parents[0].key === ':types') {
    const currentValue = settings[group][parents[0].key]
    updatedValueForState = currentValue
      ? { ...currentValue, ...updatedValueForState }
      : updatedValueForState
    updatedValueForUpdatedSettings = currentValue
      ? { ...Object.keys(currentValue)
        .reduce((acc, el) => {
          return { ...acc, [el]: [type, currentValue[el]] }
        }, {}),
      ...updatedValueForUpdatedSettings }
      : updatedValueForUpdatedSettings
  }

  return otherParents.length === 1
    ? { valueForState: updatedValueForState, valueForUpdatedSettings: updatedValueForUpdatedSettings, setting: otherParents[0] }
    : processNested(updatedValueForState, updatedValueForUpdatedSettings, group, parentKey, otherParents, settings, updatedSettings)
}

export const processNestedWithNullKey = (valueForState, valueForUpdatedSettings, group, parents, settings, updatedSettings) => {
  const [{ key, type }, ...otherParents] = parents
  const pathForState = [group, ...parents.reverse().map(parent => parent.key).slice(0, -1)]
  const updatedValueForState = valueExists('state', settings, pathForState)
    ? { ...getCurrentValue('state', settings[group], parents.map(el => el.key).slice(0, -1)),
      ...{ [key]: valueForState }}
    : { [key]: valueForState }

  const pathForUpdatedSettings = [group, 'null', ...parents.map(parent => parent.key).slice(0, -1)]
  const updatedValueForUpdatedSettings = valueExists('updatedSettings', updatedSettings, pathForUpdatedSettings)
    ? { ...getCurrentValue('updatedSettings', updatedSettings[group]['null'], parents.map(el => el.key).slice(0, -1))[1],
      ...{ [key]: [type, valueForUpdatedSettings] }}
    : { [key]: [type, valueForUpdatedSettings] }

  return { valueForState: updatedValueForState, valueForUpdatedSettings: updatedValueForUpdatedSettings, setting: otherParents[0] }
}

const valueExists = (type, settings, path) => {
  if (type === 'state') {
    return _.get(settings, path)
  } else {
    const [group, key, firstSettingName, ...restKeys] = path
    const firstSegment = _.get(settings, [group, key, firstSettingName])
    if (restKeys.length === 0 || !firstSegment) {
      return firstSegment || false
    } else {
      const secondSegment = (settings, keys) => {
        if (keys.length === 0) {
          return true
        }
        const [element, ...rest] = keys
        return settings[1][element] ? secondSegment(settings[1][element], rest) : false
      }
      return secondSegment(firstSegment, restKeys)
    }
  }
}

export const wrapUpdatedSettings = (group, settings, currentState, description) => {
  return Object.keys(settings).map((key) => {
    const settingDescription = description.find(setting => setting.key === key)
    if (key === 'null') {
      return { group, key: null, value: wrapValues(settings[key], currentState[group]) }
    } else if (settingDescription && settingDescription.type !== 'group') {
      return { group, key, value: settings[key][1] }
    } else {
      return { group, key, value: wrapValues(settings[key], currentState[group][key]) }
    }
  })
}

const wrapValues = (settings, currentState) => {
  return Object.keys(settings).map(setting => {
    const [type, value] = settings[setting]
    if (type === 'keyword' ||
      (Array.isArray(type) && (
        type.includes('keyword') ||
        (type.includes('tuple') && type.includes('list'))
      ))
    ) {
      return { 'tuple': [setting, wrapValues(value, currentState)] }
    } else if (prependWithСolon(type, value)) {
      return { 'tuple': [setting, `:${value}`] }
    } else if (type.includes('tuple') &&
      (type.includes('string') || type.includes('boolean'))) {
      return typeof value === 'string' || typeof value === 'boolean'
        ? { 'tuple': [setting, value] }
        : { 'tuple': [setting, { 'tuple': value }] }
    } else if (type === 'reversed_tuple') {
      return { 'tuple': [value, setting] }
    } else if (type === 'map') {
      const mapValue = Object.keys(value).reduce((acc, key) => {
        acc[key] = value[key][1]
        return acc
      }, {})
      return currentState && currentState[setting]
        ? { 'tuple': [setting, { ...currentState[setting], ...mapValue }] }
        : { 'tuple': [setting, mapValue] }
    } else if (type.includes('map') && !type.includes('list')) {
      const mapValue = Object.keys(value).reduce((acc, key) => {
        acc[key] = value[key][1]
        return acc
      }, {})
      return { 'tuple': [setting, mapValue] }
    } else if (setting === ':ip') {
      const ip = value.split('.').map(s => parseInt(s, 10))
      return { 'tuple': [setting, { 'tuple': ip }] }
    } else {
      return { 'tuple': [setting, value] }
    }
  })
}

export const formSearchObject = description => {
  const parseNestedSettings = (description, label, key) => description.reduce((acc, setting) => {
    const searchArray = _.compact([setting.key, setting.label, setting.description]).map(el => el.toLowerCase())
    const resultObject = { label: setting.label, key: setting.key || setting.group, groupKey: key, groupLabel: label, search: searchArray }
    if (setting.children) {
      const updatedAcc = [...acc, resultObject]
      return [...updatedAcc, ...parseNestedSettings(setting.children, label, key)]
    }
    return [...acc, resultObject]
  }, [])

  const processedDescription = description.reduce((acc, setting) => {
    const searchArray = _.compact([setting.key, setting.label, setting.description]).map(el => el.toLowerCase())
    const resultObject = { label: setting.label, key: setting.key || setting.group, groupKey: setting.key || setting.group, groupLabel: setting.label, search: searchArray }
    if (setting.children) {
      const updatedAcc = !setting.key && setting.group === ':pleroma' ? acc : [...acc, resultObject]
      return [...updatedAcc, ...parseNestedSettings(setting.children, setting.label, setting.key || setting.group)]
    }
    return !setting.key && setting.group === ':pleroma' ? acc : [...acc, resultObject]
  }, [])

  const searchDataForEditableDocs = [{
    groupKey: ':instance_panel',
    groupLabel: 'Instance Panel',
    key: ':instance_panel',
    label: 'Instance Panel',
    search: ['Instance Panel', ':instance_panel']
  }, {
    groupKey: ':terms_of_services',
    groupLabel: 'Terms of Services',
    key: ':terms_of_services',
    label: 'Terms of Services',
    search: ['Terms of Services', ':terms_of_services']
  }]
  return processedDescription.concat(searchDataForEditableDocs)
}
