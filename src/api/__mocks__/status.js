export async function changeStatusScope(id, sensitive, visibility, authHost, token) {
  return Promise.resolve()
}

export async function deleteStatus(id, authHost, token) {
  return Promise.resolve()
}

export async function fetchStatus(id, authHost, token) {
  const data = {
    account: {
      id: '9n1bySks25olxWrku0',
      avatar: 'http://localhost:4000/images/avi.png',
      nickname: 'dolin',
      display_name: 'dolin',
      tags: ['mrf_tag:media-strip', 'mrf_tag:sandbox', 'mrf_tag:disable-any-subscription', 'mrf_tag:media-force-nsfw'],
      url: 'http://localhost:4000/users/dolin'
    },
    content: 'pizza makes everything better',
    created_at: '2020-05-22T17:34:34.000Z',
    id: '9vJOO3iFPyjNaEhJ5s',
    media_attachments: [],
    poll: null,
    sensitive: false,
    spoiler_text: '',
    visibility: 'public',
    url: 'http://localhost:4000/notice/9vJOO3iFPyjNaEhJ5s'
  }

  return Promise.resolve({ data })
}

export async function fetchStatusesByInstance({ instance, godmode, page, pageSize, authHost, token }) {
  let instanceStatuses
  if (pageSize === 1) {
    instanceStatuses = page === 1 || page === 2
      ? [{
        'account': {
          'avatar': 'http://localhost:4000/images/avi.png',
          'nickname': 'sky',
          'url': 'http://localhost:4000/users/sky'
        },
        'content': 'A nice young couple contacted us from Brazil to decorate their newly acquired apartment.',
        'created_at': '2020-01-31T18:20:01.000Z',
        'id': '9rZIr0Jzao5Gjgfmro',
        'sensitive': false,
        'url': 'http://localhost:4000/objects/7af9abbd-fb6c-4318-aeb7-6636c138ac98',
        'visibility': 'unlisted'
      }]
      : []
  } else {
    instanceStatuses = [
      {
        'account': {
          'avatar': 'http://localhost:4000/images/avi.png',
          'nickname': 'sky',
          'url': 'http://localhost:4000/users/sky'
        },
        'content': 'i love parks&rec',
        'created_at': '2020-04-12T18:20:01.000Z',
        'id': 'o5Gjgfmro9rZIr0Jza',
        'sensitive': false,
        'url': 'http://localhost:4000/objects/7af9abbd-aeb7-6636c138ac98-fb6c-4318',
        'visibility': 'unlisted'
      },
      {
        'account': {
          'avatar': 'http://localhost:4000/images/avi.png',
          'nickname': 'sky',
          'url': 'http://localhost:4000/users/sky'
        },
        'content': 'the happiest man ever',
        'created_at': '2019-11-23T12:56:18.000Z',
        'id': '9pFoVfWMU3A96Rzq3k',
        'sensitive': false,
        'url': 'http://localhost:4000/objects/449c90fe-c457-4c64-baf2-fe6d0a59ca25',
        'visibility': 'unlisted'
      }]
  }
  return Promise.resolve({ data: { activities: instanceStatuses, total: 3 }})
}

export async function fetchStatusesCount(instance, authHost, token) {
  const data = instance === 'heaven.com'
    ? {
      'status_visibility':
      { 'direct': 1, 'private': 2, 'public': 3, 'unlisted': 0 }
    }
    : {
      'status_visibility':
      { 'direct': 4, 'private': 10, 'public': 4, 'unlisted': 10 }
    }
  return Promise.resolve({ data })
}

