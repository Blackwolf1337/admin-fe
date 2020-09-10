import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function deleteChatMessage(chat_id, message_id, authHost, token) {
  console.log(chat_id)
  console.log(message_id)

  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/chats/${chat_id}/messages/${message_id}`,
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
