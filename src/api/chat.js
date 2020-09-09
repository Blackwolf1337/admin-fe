import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function deleteChatMessage(id, message_id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/chats/{id}/messages/${message_id}`,
    method: 'delete',
    headers: authHeaders(token)
  })
}

export async function fetchChat(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/chats/${id}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchChatMessages(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/chats/${id}/messages`,
    method: 'get',
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
