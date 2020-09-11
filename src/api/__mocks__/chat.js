export async function fetchChat(id, authHost, token) {
  return Promise.resolve({ data: userChats[0] })
}

export async function fetchChatMessages(id, max_id, authHost, token) {
  return Promise.resolve({ data: chatMessages })
}

export async function deleteChat(chat_id, message_id, authHost, token) {
  return Promise.resolve({ data: userChats[0] })
}

export const userChats = [
  {
    id: '9y8e7ESoVUiKVMAoCW',
    last_message: {
      account_id: '9xUIiQfGrdPJDZe39s',
      attachment: null,
      card: null,
      chat_id: '9y8e7ESoVUiKVMAoCW',
      content: 'heyy',
      created_at: '2020-09-11T00:07:13.000Z',
      emojis: [],
      id: '9z22Q9MzWiAk7GZnNY',
      unread: false
    },
    receiver: {
      acct: 'test10',
      avatar: 'http://localhost:4000/images/avi.png',
      avatar_static: 'http://localhost:4000/images/avi.png',
      bot: false,
      created_at: '2020-07-27T00:33:02.000Z',
      display_name: 'test10',
      emojis: [],
      fields: [],
      followers_count: 2,
      following_count: 1,
      header: 'http://localhost:4000/images/banner.png',
      header_static: 'http://localhost:4000/images/banner.png',
      id: '9xUj5WTmzSlFPN6OLg',
      locked: false,
      note: '',
      pleroma: {
        accepts_chat_messages: true,
        ap_id: 'http://localhost:4000/users/test10',
        background_image: null,
        confirmation_pending: false,
        favicon: null,
        hide_favorites: true,
        hide_followers: false,
        hide_followers_count: false,
        hide_follows: false,
        hide_follows_count: false,
        is_admin: false,
        is_moderator: true,
        relationship: {},
        skip_thread_containment: false,
        tags: [
          'mrf_tag:media-force-nsfw',
          'mrf_tag:media-strip',
          'mrf_tag:force-unlisted'
        ]
      },
      source: {
        fields: [],
        note: '',
        pleroma: {
          actor_type: 'Person',
          discoverable: false
        },
        sensitive: false
      },
      statuses_count: 20,
      url: 'http://localhost:4000/users/test10',
      username: 'test10'
    },
    sender: {
      acct: 'mk',
      avatar: 'http://localhost:4000/media/9051960b674309674f2f1a3a0e05916013260af13f672df32c869cb841958a44.gif',
      avatar_static: 'http://localhost:4000/media/9051960b674309674f2f1a3a0e05916013260af13f672df32c869cb841958a44.gif',
      bot: false,
      created_at: '2020-07-26T19:37:31.000Z',
      display_name: 'mk',
      emojis: [],
      fields: [
        {
          name: 'website',
          value: '<a href="http://marykatefain.com" rel="ugc">marykatefain.com</a>'
        }
      ],
      followers_count: 2,
      following_count: 1,
      header: 'http://localhost:4000/media/139889433c4085dcf219171fdcc48659fa3fb5090a748ca37513fda051226b12.gif',
      header_static: 'http://localhost:4000/media/139889433c4085dcf219171fdcc48659fa3fb5090a748ca37513fda051226b12.gif',
      id: '9xUIiQfGrdPJDZe39s',
      locked: false,
      note: 'a bio about me',
      pleroma: {
        accepts_chat_messages: true,
        ap_id: 'https://localhost/users/mk',
        background_image: null,
        confirmation_pending: false,
        favicon: null,
        hide_favorites: true,
        hide_followers: false,
        hide_followers_count: false,
        hide_follows: false,
        hide_follows_count: false,
        is_admin: true,
        is_moderator: false,
        relationship: {},
        skip_thread_containment: false,
        tags: [
          'verified'
        ]
      },
      source: {
        fields: [
          {
            name: 'website',
            value: 'marykatefain.com'
          }
        ],
        note: 'a bio about me',
        pleroma: {
          actor_type: 'Person',
          discoverable: false
        },
        sensitive: false
      },
      statuses_count: 77,
      url: 'https://localhost/users/mk',
      username: 'mk'
    },
    unread: 0,
    updated_at: '2020-09-11T00:07:13.000Z'
  },
  {
    id: '9y8dwDAQzFBZIZJzEG',
    last_message: {
      account_id: '9xUIiQfGrdPJDZe39s',
      attachment: null,
      card: null,
      chat_id: '9y8dwDAQzFBZIZJzEG',
      content: 'hiiiiiiiiiiiiiiiiiii',
      created_at: '2020-08-15T06:45:13.000Z',
      emojis: [],
      id: '9y8e4EZndDmfzA0lGa',
      unread: false
    },
    receiver: {
      acct: 'user2',
      avatar: 'http://localhost:4000/media/5a702176cd5181f81532a42fafa87953db1586ca39a3c83cd3df1bc9b5cb7d07.png',
      avatar_static: 'http://localhost:4000/media/5a702176cd5181f81532a42fafa87953db1586ca39a3c83cd3df1bc9b5cb7d07.png',
      bot: false,
      created_at: '2020-08-01T19:23:57.000Z',
      display_name: 'User2',
      emojis: [],
      fields: [],
      followers_count: 0,
      following_count: 2,
      header: 'http://localhost:4000/media/1b1fc87d56e4f94b0ca8eb23100c92f67371bfa37b2898cd804341ed1a2d5c84.jpg',
      header_static: 'http://localhost:4000/media/1b1fc87d56e4f94b0ca8eb23100c92f67371bfa37b2898cd804341ed1a2d5c84.jpg',
      id: '9xfhRuCIyydruc0Sh6',
      locked: false,
      note: 'Just me!',
      pleroma: {
        accepts_chat_messages: true,
        ap_id: 'http://localhost:4000/users/user2',
        background_image: null,
        confirmation_pending: true,
        favicon: null,
        hide_favorites: true,
        hide_followers: false,
        hide_followers_count: false,
        hide_follows: false,
        hide_follows_count: false,
        is_admin: false,
        is_moderator: false,
        relationship: {},
        skip_thread_containment: false,
        tags: [
          'mrf_tag:force-unlisted',
          'mrf_tag:media-strip'
        ]
      },
      source: {
        fields: [],
        note: 'Just me!',
        pleroma: {
          actor_type: 'Person',
          discoverable: false
        },
        sensitive: false
      },
      statuses_count: 69,
      url: 'http://localhost:4000/users/user2',
      username: 'user2'
    },
    sender: {
      acct: 'mk',
      avatar: 'http://localhost:4000/media/9051960b674309674f2f1a3a0e05916013260af13f672df32c869cb841958a44.gif',
      avatar_static: 'http://localhost:4000/media/9051960b674309674f2f1a3a0e05916013260af13f672df32c869cb841958a44.gif',
      bot: false,
      created_at: '2020-07-26T19:37:31.000Z',
      display_name: 'mk',
      emojis: [],
      fields: [
        {
          name: 'website',
          value: '<a href="http://marykatefain.com" rel="ugc">marykatefain.com</a>'
        }
      ],
      followers_count: 2,
      following_count: 1,
      header: 'http://localhost:4000/media/139889433c4085dcf219171fdcc48659fa3fb5090a748ca37513fda051226b12.gif',
      header_static: 'http://localhost:4000/media/139889433c4085dcf219171fdcc48659fa3fb5090a748ca37513fda051226b12.gif',
      id: '9xUIiQfGrdPJDZe39s',
      locked: false,
      note: 'a bio about me',
      pleroma: {
        accepts_chat_messages: true,
        ap_id: 'https://localhost/users/mk',
        background_image: null,
        confirmation_pending: false,
        favicon: null,
        hide_favorites: true,
        hide_followers: false,
        hide_followers_count: false,
        hide_follows: false,
        hide_follows_count: false,
        is_admin: true,
        is_moderator: false,
        relationship: {},
        skip_thread_containment: false,
        tags: [
          'verified'
        ]
      },
      source: {
        fields: [
          {
            name: 'website',
            value: 'marykatefain.com'
          }
        ],
        note: 'a bio about me',
        pleroma: {
          actor_type: 'Person',
          discoverable: false
        },
        sensitive: false
      },
      statuses_count: 77,
      url: 'https://localhost/users/mk',
      username: 'mk'
    },
    unread: 0,
    updated_at: '2020-08-15T06:45:13.000Z'
  },
  {
    id: '9y8dubemxq32fkkoeu',
    last_message: null,
    receiver: {
      acct: 'mk',
      avatar: 'http://localhost:4000/media/9051960b674309674f2f1a3a0e05916013260af13f672df32c869cb841958a44.gif',
      avatar_static: 'http://localhost:4000/media/9051960b674309674f2f1a3a0e05916013260af13f672df32c869cb841958a44.gif',
      bot: false,
      created_at: '2020-07-26T19:37:31.000Z',
      display_name: 'mk',
      emojis: [],
      fields: [
        {
          name: 'website',
          value: '<a href="http://marykatefain.com" rel="ugc">marykatefain.com</a>'
        }
      ],
      followers_count: 2,
      following_count: 1,
      header: 'http://localhost:4000/media/139889433c4085dcf219171fdcc48659fa3fb5090a748ca37513fda051226b12.gif',
      header_static: 'http://localhost:4000/media/139889433c4085dcf219171fdcc48659fa3fb5090a748ca37513fda051226b12.gif',
      id: '9xUIiQfGrdPJDZe39s',
      locked: false,
      note: 'a bio about me',
      pleroma: {
        accepts_chat_messages: true,
        ap_id: 'https://localhost/users/mk',
        background_image: null,
        confirmation_pending: false,
        favicon: null,
        hide_favorites: true,
        hide_followers: false,
        hide_followers_count: false,
        hide_follows: false,
        hide_follows_count: false,
        is_admin: true,
        is_moderator: false,
        relationship: {},
        skip_thread_containment: false,
        tags: [
          'verified'
        ]
      },
      source: {
        fields: [
          {
            name: 'website',
            value: 'marykatefain.com'
          }
        ],
        note: 'a bio about me',
        pleroma: {
          actor_type: 'Person',
          discoverable: false
        },
        sensitive: false
      },
      statuses_count: 77,
      url: 'https://localhost/users/mk',
      username: 'mk'
    },
    sender: {
      acct: 'mk',
      avatar: 'http://localhost:4000/media/9051960b674309674f2f1a3a0e05916013260af13f672df32c869cb841958a44.gif',
      avatar_static: 'http://localhost:4000/media/9051960b674309674f2f1a3a0e05916013260af13f672df32c869cb841958a44.gif',
      bot: false,
      created_at: '2020-07-26T19:37:31.000Z',
      display_name: 'mk',
      emojis: [],
      fields: [
        {
          name: 'website',
          value: '<a href="http://marykatefain.com" rel="ugc">marykatefain.com</a>'
        }
      ],
      followers_count: 2,
      following_count: 1,
      header: 'http://localhost:4000/media/139889433c4085dcf219171fdcc48659fa3fb5090a748ca37513fda051226b12.gif',
      header_static: 'http://localhost:4000/media/139889433c4085dcf219171fdcc48659fa3fb5090a748ca37513fda051226b12.gif',
      id: '9xUIiQfGrdPJDZe39s',
      locked: false,
      note: 'a bio about me',
      pleroma: {
        accepts_chat_messages: true,
        ap_id: 'https://localhost/users/mk',
        background_image: null,
        confirmation_pending: false,
        favicon: null,
        hide_favorites: true,
        hide_followers: false,
        hide_followers_count: false,
        hide_follows: false,
        hide_follows_count: false,
        is_admin: true,
        is_moderator: false,
        relationship: {},
        skip_thread_containment: false,
        tags: [
          'verified'
        ]
      },
      source: {
        fields: [
          {
            name: 'website',
            value: 'marykatefain.com'
          }
        ],
        note: 'a bio about me',
        pleroma: {
          actor_type: 'Person',
          discoverable: false
        },
        sensitive: false
      },
      statuses_count: 77,
      url: 'https://localhost/users/mk',
      username: 'mk'
    },
    unread: 0,
    updated_at: '2020-08-15T06:43:29.000Z'
  }
]

export const chatMessages = [
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'heyy',
    created_at: '2020-09-11T00:07:13.000Z',
    emojis: [],
    id: '9z22Q9MzWiAk7GZnNY',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: {
      description: null,
      id: '-1990764178',
      pleroma: {
        mime_type: 'image/png'
      },
      preview_url: 'http://localhost:4000/media/b087b890b39aa8301f736e8b45c02213183986c8a994c2c99e921ae85afa17e4.png',
      remote_url: 'http://localhost:4000/media/b087b890b39aa8301f736e8b45c02213183986c8a994c2c99e921ae85afa17e4.png',
      text_url: 'http://localhost:4000/media/b087b890b39aa8301f736e8b45c02213183986c8a994c2c99e921ae85afa17e4.png',
      type: 'image',
      url: 'http://localhost:4000/media/b087b890b39aa8301f736e8b45c02213183986c8a994c2c99e921ae85afa17e4.png'
    },
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: null,
    created_at: '2020-09-10T20:35:33.000Z',
    emojis: [],
    id: '9z1jWuQNaq8Ef6fdOS',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'probably',
    created_at: '2020-09-10T16:57:33.000Z',
    emojis: [],
    id: '9z1Q4eXb9kBYA8rNT6',
    unread: false
  },
  {
    account_id: '9xUj5WTmzSlFPN6OLg',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'That has got to be 20 by now',
    created_at: '2020-09-10T16:57:29.000Z',
    emojis: [],
    id: '9z1Q4LQAF9wuraEfk8',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'I miss bars :(',
    created_at: '2020-09-10T16:57:22.000Z',
    emojis: [],
    id: '9z1Q3gmlKEfEpnUdm4',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'Yeah tying to!',
    created_at: '2020-09-10T16:57:15.000Z',
    emojis: [],
    id: '9z1Q307VxCiKVhs6eO',
    unread: false
  },
  {
    account_id: '9xUj5WTmzSlFPN6OLg',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'staying safe with covid and such?',
    created_at: '2020-09-10T16:57:10.000Z',
    emojis: [],
    id: '9z1Q2Z56U3k6ePXIe1',
    unread: false
  },
  {
    account_id: '9xUj5WTmzSlFPN6OLg',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'how have you been?',
    created_at: '2020-09-10T16:57:06.000Z',
    emojis: [],
    id: '9z1Q29XvQHLfSGowxU',
    unread: false
  },
  {
    account_id: '9xUj5WTmzSlFPN6OLg',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'so what are you doing?',
    created_at: '2020-09-10T16:57:02.000Z',
    emojis: [],
    id: '9z1Q1lPb9aQYbUjxeD',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'crazy',
    created_at: '2020-09-10T16:56:55.000Z',
    emojis: [],
    id: '9z1Q19zQHwVMXbD2DA',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'omg yeah same',
    created_at: '2020-09-10T16:56:54.000Z',
    emojis: [],
    id: '9z1Q12zWJBQIpsCVtI',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'hahahaha',
    created_at: '2020-09-10T16:56:51.000Z',
    emojis: [],
    id: '9z1Q0pyKiHkWSQXsjg',
    unread: false
  },
  {
    account_id: '9xUj5WTmzSlFPN6OLg',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'I think this is 13',
    created_at: '2020-09-10T16:56:45.000Z',
    emojis: [],
    id: '9z1Q0Ft6sEBGXnpCb3',
    unread: false
  },
  {
    account_id: '9xUj5WTmzSlFPN6OLg',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'We need to keep typing until we hit 20',
    created_at: '2020-09-10T16:56:42.000Z',
    emojis: [],
    id: '9z1PzywjrTyy08OMOO',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'That&#39;s nice',
    created_at: '2020-09-10T16:56:03.000Z',
    emojis: [],
    id: '9z1PwOkJzs8orKsJDU',
    unread: false
  },
  {
    account_id: '9xUj5WTmzSlFPN6OLg',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'I&#39;ve been good! Keeping busy',
    created_at: '2020-09-10T16:56:00.000Z',
    emojis: [],
    id: '9z1Pw7qmoaDASSljQv',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: '*been',
    created_at: '2020-09-10T16:55:55.000Z',
    emojis: [],
    id: '9z1PvcWVHwZFIa2b0y',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'How have you ben?',
    created_at: '2020-09-10T16:55:52.000Z',
    emojis: [],
    id: '9z1PvK4BuTE03YejNw',
    unread: false
  },
  {
    account_id: '9xUIiQfGrdPJDZe39s',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'Oh it&#39;s okay! No worries!',
    created_at: '2020-09-10T16:55:44.000Z',
    emojis: [],
    id: '9z1Puc4hTDUJcOYW4O',
    unread: false
  },
  {
    account_id: '9xUj5WTmzSlFPN6OLg',
    attachment: null,
    card: null,
    chat_id: '9y8e7ESoVUiKVMAoCW',
    content: 'didn&#39;t mean to ignore you',
    created_at: '2020-09-10T16:55:32.000Z',
    emojis: [],
    id: '9z1PtWGNamQTIvUspk',
    unread: false
  }
]
