import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { baseName } from './utils'

export async function changeState(reports, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/reports`,
    method: 'patch',
    headers: authHeaders(token),
    data: { reports }
  })
}

export async function fetchReports(filter, page, pageSize, authHost, token) {
  const url = filter.length > 0
    ? `/api/pleroma/admin/reports?state=${filter}&page=${page}&page_size=${pageSize}`
    : `/api/pleroma/admin/reports?page=${page}&page_size=${pageSize}`
  return await request({
    baseURL: baseName(authHost),
    url,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function fetchSingleReport(id, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/reports/${id}`,
    method: 'get',
    headers: authHeaders(token)
  })
}

export async function createNote(content, reportID, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/reports/${reportID}/notes`,
    method: `post`,
    headers: authHeaders(token),
    data: { content }
  })
}

export async function deleteNote(noteID, reportID, authHost, token) {
  return await request({
    baseURL: baseName(authHost),
    url: `/api/pleroma/admin/reports/${reportID}/notes/${noteID}`,
    method: `delete`,
    headers: authHeaders(token)
  })
}

const authHeaders = (token) => token ? { 'Authorization': `Bearer ${getToken()}` } : {}
