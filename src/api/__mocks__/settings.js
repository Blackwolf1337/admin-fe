const configsWithTagPolicy = {
  configs: [{
    group: ':pleroma',
    key: ':mrf',
    value: [
      { tuple: [':policies', ['Pleroma.Web.ActivityPub.MRF.ObjectAgePolicy', 'Pleroma.Web.ActivityPub.MRF.TagPolicy']] },
      { tuple: [':transparency', true] },
      { tuple: [':transparency_exclusions', []] }
    ] },
  {
    group: ':pleroma',
    key: ':media_proxy',
    value: [
      { tuple: [':enabled', true] },
      { tuple: [':invalidation', [
        { tuple: [':provider', 'Pleroma.Web.MediaProxy.Invalidation.Script'] },
        { tuple: [':enabled', true] }
      ]] }
    ] }],
  need_reboot: false
}

const configAfterUpdate = {
  configs: [{
    db: [':policies'],
    group: ':pleroma',
    key: ':mrf',
    value: [{ tuple: [':policies', ['Pleroma.Web.ActivityPub.MRF.ObjectAgePolicy', 'Pleroma.Web.ActivityPub.MRF.TagPolicy']] }]
  }],
  need_reboot: false
}

export async function fetchSettings(authHost, token) {
  return Promise.resolve({ data: configsWithTagPolicy })
}

export async function getInstanceDocument(name, authHost, token) {
  return Promise.resolve({ data: '<h1>Instance panel</h1>' })
}

export async function updateSettings(configs, authHost, token) {
  return Promise.resolve({ data: configAfterUpdate })
}

export async function deleteInstanceDocument(name, authHost, token) {
  return Promise.resolve()
}

export async function fetchDescription(authHost, token) {
  return Promise.resolve()
}

export async function updateInstanceDocument(name, formData, authHost, token) {
  return Promise.resolve()
}

export async function removeSettings(configs, authHost, token) {
  return Promise.resolve()
}
