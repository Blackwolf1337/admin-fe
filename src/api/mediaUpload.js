import { getToken } from '@/utils/auth'
import { baseName } from './utils'

const UPLOAD_URL = '/api/v1/media'

export function uploadMedia({ formData, authHost }) {
  const url = baseName(authHost) + UPLOAD_URL

  return fetch(url, {
    body: formData,
    method: 'POST',
    headers: authHeaders()
  })
    .then((data) => data.json())
}

const authHeaders = () => {
  return { 'Authorization': `Bearer ${getToken()}` }
}
