const reports = [
  { created_at: '2019-05-21T21:35:33.000Z', account: { nickname: 'benjamin', tags: [] }, actor: {}, state: 'open', id: '2', content: 'This is a report', statuses: [] },
  { created_at: '2019-05-20T22:45:33.000Z', account: { nickname: 'alice', tags: [] }, actor: {}, state: 'resolved', id: '1', content: 'Please block this user', statuses: [] },
  { created_at: '2019-05-18T13:01:33.000Z', account: { nickname: 'nick_keys', tags: [] }, actor: {}, state: 'closed', id: '3', content: '', statuses: [] },
  { created_at: '2019-05-21T21:35:33.000Z', account: { nickname: 'benjamin', tags: [] }, actor: {}, state: 'open', id: '5', content: 'This is a report', statuses: [] },
  { created_at: '2019-05-20T22:45:33.000Z', account: { nickname: 'alice', tags: [] }, actor: {}, state: 'resolved', id: '7', content: 'Please block this user', statuses: [
    { account: { nickname: 'alice', avatar: '' }, visibility: 'public', sensitive: false, id: '11', content: 'Hey!', url: '', created_at: '2019-05-10T21:35:33.000Z' },
    { account: { nickname: 'alice', avatar: '' }, visibility: 'unlisted', sensitive: true, id: '10', content: 'Bye!', url: '', created_at: '2019-05-10T21:00:33.000Z' }
  ] },
  { created_at: '2019-05-18T13:01:33.000Z', account: { nickname: 'nick_keys', tags: [] }, actor: {}, state: 'closed', id: '6', content: '', statuses: [] },
  { created_at: '2019-05-18T13:01:33.000Z', account: { nickname: 'nick_keys', tags: [] }, actor: {}, state: 'closed', id: '4', content: '', statuses: [] }
]

export async function fetchReports(filter, page, pageSize, authHost, token) {
  return filter.length > 0
    ? Promise.resolve({ data: { reports: reports.filter(report => report.state === filter) }})
    : Promise.resolve({ data: { reports }})
}

export async function changeState(reportsData, authHost, token) {
  return Promise.resolve({ data: '' })
}

export async function createNote(content, reportID, authHost, token) {
  return Promise.resolve()
}

export async function deleteNote(noteID, reportID, authHost, token) {
  return Promise.resolve()
}

// export async function changeStatusScope(id, sensitive, visibility, authHost, token) {
//   const status = reports[4].statuses[0]
//   return Promise.resolve({ data: { ...status, sensitive, visibility }})
// }

// export async function deleteStatus(statusId, authHost, token) {
//   return Promise.resolve()
// }
