import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function generateInviteToken(max_use, expires_at, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/invite_token`,
    method: 'post',
    headers: authHeaders(token),
    data: expires_at && expires_at.length > 0 ? { max_use, expires_at } : { max_use }
  })
}

export async function inviteViaEmail(email, name, authHost, token) {
  const url = name.length > 0
    ? `/api/pleroma/admin/users/email_invite?email=${email}&name=${name}`
    : `/api/pleroma/admin/users/email_invite?email=${email}`
  return await request({
    baseURL: baseName(authHost),
    url,
    method: 'post',
    headers: authHeaders(token)
  })
}

export async function listInviteTokens(authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/invites`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function revokeToken(tokenToRevoke, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/users/revoke_invite`,
    method: 'post',
    headers: authHeaders(token),
    data: { token: tokenToRevoke }
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
