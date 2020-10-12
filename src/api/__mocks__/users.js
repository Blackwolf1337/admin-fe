export let users = [
  { active: true, approval_pending: false, deactivated: false, id: '2', nickname: 'allis', local: true, external: false, roles: { admin: true, moderator: false }, tags: [], actor_type: 'Person' },
  { active: true, approval_pending: false, deactivated: false, id: '10', nickname: 'bob', local: false, external: true, roles: { admin: false, moderator: false }, tags: ['mrf_tag:sandbox'], actor_type: 'Person' },
  { active: false, approval_pending: false, deactivated: true, id: 'abc', nickname: 'john', local: true, external: false, roles: { admin: false, moderator: false }, tags: ['mrf_tag:media-strip'], actor_type: 'Person' },
  { active: true, approval_pending: true, deactivated: false, id: '100', nickname: 'sally', local: true, external: false, roles: { admin: false, moderator: false }, tags: [], actor_type: 'Service' }
]

const userProfile = { avatar: 'avatar.jpg', nickname: 'allis', id: '2', tags: [], roles: { admin: true, moderator: false }, local: true, external: false }

const userStatuses = [
  { account: { id: '9n1bySks25olxWrku0', nickname: 'dolin' }, content: 'pizza makes everything better', id: '9vJOO3iFPyjNaEhJ5s', created_at: '2020-05-22T17:34:34.000Z', visibility: 'public' },
  { account: { id: '9n1bySks25olxWrku0', nickname: 'dolin' }, content: 'pizza time', id: '9vJPD5XKOdzQ0bvGLY', created_at: '2020-05-22T17:34:34.000Z', visibility: 'public' },
  { account: { id: '9n1bySks25olxWrku0', nickname: 'dolin' }, content: 'what is yout favorite pizza?', id: '9jop82OBXeFPYulVjM', created_at: '2020-05-22T17:34:34.000Z', visibility: 'public' }
]

const filterUsers = (str) => {
  const filters = str.split(',').filter(item => item.length > 0)
  if (filters.length === 0) {
    return users
  }
  const applyFilters = (acc, filters, users) => {
    if (filters.length === 0) {
      return acc
    }
    const filteredUsers = users.filter(user => user[filters[0]])
    const newAcc = [...filteredUsers]
    return applyFilters(newAcc, filters.slice(1), filteredUsers)
  }
  return applyFilters([], filters, users)
}

export async function fetchUser(id, authHost, token) {
  return Promise.resolve({ data: userProfile })
}

export async function fetchUserCredentials(nickname, authHost, token) {
  return Promise.resolve({ data: {}})
}

export async function fetchUsers(filters, authHost, token, page = 1) {
  const filteredUsers = filterUsers(filters)
  return Promise.resolve({ data: {
    users: filteredUsers,
    count: filteredUsers.length,
    page_size: 50
  }})
}

export async function fetchUserStatuses(id, authHost, godmode, token) {
  return Promise.resolve({ data: userStatuses })
}

export async function getPasswordResetToken(nickname, authHost, token) {
  return Promise.resolve({ data: { token: 'g05lxnBJQnL', link: 'http://url/api/pleroma/password_reset/g05lxnBJQnL' }})
}

export async function searchUsers(query, filters, authHost, token, page = 1) {
  const filteredUsers = filterUsers(filters)
  const response = filteredUsers.filter(user => user.nickname === query)
  return Promise.resolve({ data: {
    users: response,
    count: response.length,
    page_size: 50
  }})
}

export async function activateUsers(nicknames, authHost, token) {
  const response = nicknames.map(nickname => {
    const currentUser = users.find(user => user.nickname === nickname)
    return { ...currentUser, deactivated: false }
  })
  return Promise.resolve({ data: response })
}

export async function addRight(nicknames, right, authHost, token) {
  return Promise.resolve({ data:
    { [`is_${right}`]: true }
  })
}

export async function deactivateUsers(nicknames, authHost, token) {
  const response = nicknames.map(nickname => {
    const currentUser = users.find(user => user.nickname === nickname)
    return { ...currentUser, deactivated: true }
  })
  return Promise.resolve({ data: response })
}

export async function approveUserAccount(nicknames, authHost, token) {
  const response = nicknames.map(nickname => {
    const currentUser = users.find(user => user.nickname === nickname)
    return { ...currentUser, approval_pending: false }
  })
  return Promise.resolve({ data: response })
}

export async function deleteRight(nickname, right, authHost, token) {
  return Promise.resolve({ data:
    { [`is_${right}`]: false }
  })
}

export async function deleteUsers(nicknames, authHost, token) {
  return Promise.resolve({ data:
    nicknames
  })
}

export async function tagUser(nickname, tag, authHost, token) {
  return Promise.resolve()
}

export async function untagUser(nickname, tag, authHost, token) {
  return Promise.resolve()
}

export async function createNewAccount(nickname, email, password, authHost, token) {
  const newUser = { active: true, deactivated: false, id: '15', nickname, local: true, external: false, roles: { admin: false, moderator: false }, tags: [] }
  users = [...users, newUser]
  return Promise.resolve()
}

export async function updateUserCredentials(nickname, credentials, authHost, token) {
  return Promise.resolve()
}

export async function disableMfa(nickname, authHost, token) {
  return Promise.resolve()
}

export async function forcePasswordReset(nicknames, authHost, token) {
  return Promise.resolve()
}

export async function confirmUserEmail(nicknames, authHost, token) {
  return Promise.resolve()
}

export async function resendConfirmationEmail(nicknames, authHost, token) {
  return Promise.resolve()
}
