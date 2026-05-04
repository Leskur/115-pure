import { apiClient } from './client'
import type { FileListResponse, DownloadUrl } from '@/types'

export async function getFileList(
  cid: string = '0',
  offset: number = 0,
  limit: number = 100,
  order: string = 'file_name',
  asc: number = 1
): Promise<FileListResponse> {
  const response = await apiClient.get('/open/ufile/files', {
    params: { cid, offset, limit, order, asc, show_dir: 1 },
  })
  return response.data
}

export async function getFileDetail(fileId: string) {
  const response = await apiClient.get('/open/ufile/detail', {
    params: { file_id: fileId },
  })
  return response.data
}

export async function searchFiles(keyword: string, cid: string = '0', offset: number = 0, limit: number = 100) {
  const response = await apiClient.get('/open/ufile/search', {
    params: { search_value: keyword, cid, offset, limit },
  })
  return response.data
}

export async function createFolder(parentCid: string, name: string) {
  const response = await apiClient.post('/open/ufile/add_folder', {
    pid: parentCid,
    file_name: name,
  })
  return response.data
}

export async function deleteFiles(fileIds: string[]) {
  const response = await apiClient.post('/open/ufile/delete', {
    file_ids: fileIds.join(','),
  })
  return response.data
}

export async function moveFiles(fileIds: string[], targetCid: string) {
  const response = await apiClient.post('/open/ufile/move', {
    file_ids: fileIds.join(','),
    to_cid: targetCid,
  })
  return response.data
}

export async function copyFiles(fileIds: string[], targetCid: string) {
  const response = await apiClient.post('/open/ufile/copy', {
    file_ids: fileIds.join(','),
    to_cid: targetCid,
  })
  return response.data
}

export async function renameFile(fileId: string, newName: string) {
  const response = await apiClient.post('/open/ufile/update', {
    file_id: fileId,
    file_name: newName,
  })
  return response.data
}

export async function getDownloadUrl(pickCode: string): Promise<DownloadUrl> {
  const response = await apiClient.get('/open/ufile/download_url', {
    params: { pick_code: pickCode },
  })
  return response.data
}
