const urls = [
  'http://example.com/media/a688346.jpg',
  'http://example.com/media/fb1f4d.jpg'
]

export async function listBannedUrls(page, pageSize, authHost, token) {
  return Promise.resolve({ data: { page_size: 1, count: 2, urls }})
}

export async function purgeUrls(urls, ban, authHost, token) {
  return Promise.resolve()
}

export async function removeBannedUrls(urls, authHost, token) {
  return Promise.resolve()
}

export async function searchBannedUrls(query, page, pageSize, authHost, token) {
  return Promise.resolve()
}
