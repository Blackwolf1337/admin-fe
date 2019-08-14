const nonAtomsTuples = ['replace', 'match_actor', ':replace', ':match_actor']
const groups = {
  'cors_plug': [
    'credentials',
    'expose',
    'headers',
    'max_age',
    'methods'
  ],
  'esshd': [
    'enabled',
    'handler',
    'password_authenticator',
    'port',
    'priv_dir'
  ],
  'logger': ['backends', 'console', 'ex_syslogger'],
  'mime': ['types'],
  'phoenix': ['format_encoders'],
  'pleroma': [
    'Pleroma.Captcha',
    'Pleroma.Captcha.Kocaptcha',
    'Pleroma.Emails.Mailer',
    'Pleroma.Repo',
    'Pleroma.ScheduledActivity',
    'Pleroma.Upload',
    'Pleroma.Upload.Filter.AnonymizeFilename',
    'Pleroma.Upload.Filter.Mogrify',
    'Pleroma.Uploaders.Local',
    'Pleroma.Uploaders.MDII',
    'Pleroma.Uploaders.S3',
    'Pleroma.User',
    'Pleroma.Web.Auth.Authenticator',
    'Pleroma.Web.Endpoint',
    'Pleroma.Web.Federator.RetryQueue',
    'Pleroma.Web.Metadata',
    'activitypub',
    'admin_token',
    'assets',
    'auth',
    'auto_linker',
    'chat',
    'database',
    'ecto_repos',
    'emoji',
    'env',
    'fetch_initial_posts',
    'frontend_configurations',
    'gopher',
    'hackney_pools',
    'http',
    'http_security',
    'instance',
    'ldap',
    'markup',
    'media_proxy',
    'mrf_hellthread',
    'mrf_keyword',
    'mrf_mention',
    'mrf_normalize_markup',
    'mrf_rejectnonpublic',
    'mrf_simple',
    'mrf_subchain',
    'mrf_user_allowlist',
    'oauth2',
    'rate_limit',
    'rich_media',
    'suggestions',
    'uri_schemes',
    'user'
  ],
  'pleroma_job_queue': ['queues'],
  'quack': ['level', 'meta', 'webhook_url'],
  'tesla': ['adapter'],
  'ueberauth': [
    'Ueberauth',
    'Ueberauth.Strategy.Facebook.OAuth',
    'Ueberauth.Strategy.Google.OAuth',
    'Ueberauth.Strategy.Microsoft.OAuth',
    'Ueberauth.Strategy.Twitter.OAuth'
  ],
  'web_push_encryption': ['vapid_details']
}

export const filterIgnored = (settings, ignored) => {
  if (settings.enabled.value === true) {
    return settings
  }

  return ignored.reduce((acc, name) => {
    const { [name]: ignored, ...newAcc } = acc

    return newAcc
  }, settings)
}

// REFACTOR
export const parseTuples = (tuples, key) => {
  return tuples.reduce((accum, item) => {
    if (key === 'rate_limit') {
      accum[item.tuple[0].substr(1)] = item.tuple[1]
    } else if (Array.isArray(item.tuple[1]) &&
       (typeof item.tuple[1][0] === 'object' && !Array.isArray(item.tuple[1][0])) && item.tuple[1][0]['tuple']) {
      nonAtomsTuples.includes(item.tuple[0])
        ? accum[item.tuple[0].substr(1)] = parseNonAtomTuples(item.tuple[1])
        : accum[item.tuple[0].substr(1)] = parseTuples(item.tuple[1])
    } else if (item.tuple[1] && typeof item.tuple[1] === 'object' && 'tuple' in item.tuple[1]) {
      accum[item.tuple[0].substr(1)] = item.tuple[1]['tuple'].join('.')
    } else {
      key === 'mrf_user_allowlist'
        ? accum[item.tuple[0]] = item.tuple[1]
        : accum[item.tuple[0].substr(1)] = item.tuple[1]
    }
    return accum
  }, {})
}

const parseNonAtomTuples = (tuples) => {
  return tuples.reduce((acc, item) => {
    acc[item.tuple[0]] = item.tuple[1]
    return acc
  }, {})
}

export const valueHasTuples = (key, value) => {
  const valueIsArrayOfNonObjects = Array.isArray(value) && value.length > 0 && typeof value[0] !== 'object'
  return key === 'meta' ||
    key === 'types' ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    valueIsArrayOfNonObjects
}

// REFACTOR
export const wrapConfig = settings => {
  return Object.keys(settings).map(config => {
    const group = getGroup(config)
    const key = config.startsWith('Pleroma') || config.startsWith('Ueberauth') ? config : `:${config}`
    const value = (settings[config]['value'] !== undefined)
      ? settings[config]['value']
      : Object.keys(settings[config]).reduce((acc, settingName) => {
        const data = settings[config][settingName]
        if (data === '') {
          return acc
        } else if (key === ':rate_limit') {
          return [...acc, { 'tuple': [`:${settingName}`, data] }]
        } else if (settingName === 'ip') {
          const ip = data.split('.')
          return [...acc, { 'tuple': [`:${settingName}`, { 'tuple': ip }] }]
        } else if (!Array.isArray(data) && typeof data === 'object') {
          return nonAtomsTuples.includes(settingName)
            ? [...acc, { 'tuple': [`:${settingName}`, wrapNonAtomsTuples(data)] }]
            : [...acc, { 'tuple': [`:${settingName}`, wrapNestedTuples(data)] }]
        }
        return key === ':mrf_user_allowlist'
          ? [...acc, { 'tuple': [`${settingName}`, settings[config][settingName]] }]
          : [...acc, { 'tuple': [`:${settingName}`, settings[config][settingName]] }]
      }, [])
    return { group, key, value }
  })
}

const wrapNestedTuples = setting => {
  return Object.keys(setting).reduce((acc, settingName) => {
    const data = setting[settingName]
    if (data === '') {
      return acc
    } else if (settingName === 'ip') {
      const ip = data.split('.')
      return [...acc, { 'tuple': [`:${settingName}`, { 'tuple': ip }] }]
    } else if (!Array.isArray(data) && typeof data === 'object') {
      return [...acc, { 'tuple': [`:${settingName}`, wrapNestedTuples(data)] }]
    }
    return [...acc, { 'tuple': [`:${settingName}`, setting[settingName]] }]
  }, [])
}

const wrapNonAtomsTuples = setting => {
  return Object.keys(setting).reduce((acc, settingName) => {
    return [...acc, { 'tuple': [`${settingName}`, setting[settingName]] }]
  }, [])
}

const getGroup = key => {
  return Object.keys(groups).find(i => groups[i].includes(key))
}
