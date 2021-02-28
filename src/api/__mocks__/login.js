const users = [
  { username: 'bob', password: '123456', authHost: 'pleroma' }
]

export async function loginByUsername(username, password, authHost) {
  const user = users.find(user => user.username === username)
  const verifyPassword = user.password === password
  const verifyHost = user.authHost === authHost
  const data = {
    'token_type': 'Bearer',
    'scope': 'read write follow push admin',
    'refresh_token': 'foo123',
    'me': 'bob',
    'expires_in': 600,
    'access_token': 'bar123'
  }

  return verifyPassword && verifyHost
    ? Promise.resolve({ data })
    : Promise.reject({ message: 'Invalid credentials' })
}

export function getUserInfo(token, authHost) {
  const userInfo = {
    'name_html': 'bob',
    'background_image': null,
    'friends_count': 0,
    'description_html': '',
    'followers_count': 0,
    'locked': false,
    'follows_you': true,
    'statusnet_blocking': false,
    'statusnet_profile_url': '',
    'following': true,
    'id': '10',
    'is_local': true,
    'profile_image_url': '',
    'role': 'admin',
    'profile_image_url_profile_size': '',
    'rights': { 'admin': true, 'delete_others_notice': true },
    'token': 'foo123456',
    'no_rich_text': false,
    'statuses_count': 0,
    'cover_photo': '',
    'hide_follows': false,
    'pleroma': { 'is_confirmed': true, 'is_active': true, 'tags': ['force_nsfw'], 'is_admin': true },
    'profile_image_url_original': '',
    'created_at': 'Fri Mar 01 15:15:19 +0000 2019',
    'fields': [],
    'name': 'bob',
    'description': '',
    'favourites_count': 0,
    'default_scope': 'public',
    'profile_image_url_https': '',
    'hide_followers': false,
    'show_role': true,
    'screen_name': 'bob' }

  return Promise.resolve({ data: userInfo })
}
