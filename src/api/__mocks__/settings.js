const configsWithoutTagPolicy = {
  configs: [{
    group: ':pleroma',
    key: ':mrf',
    value: [
      { tuple: [':policies', 'Pleroma.Web.ActivityPub.MRF.ObjectAgePolicy'] },
      { tuple: [':transparency', true] },
      { tuple: [':transparency_exclusions', []] }
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
  return Promise.resolve({ data: configsWithoutTagPolicy })
}

export async function updateSettings(configs, authHost, token) {
  return Promise.resolve({ data: configAfterUpdate })
}
