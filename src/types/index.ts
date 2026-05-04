export interface UserInfo {
  user_id: number
  user_name: string
  face: string
  vip: number
}

export interface FileItem {
  fid: string
  pid: string
  uid: number
  aid: number
  n: string
  s: number
  sta: number
  pt: string
  t: string
  tp: number
  te: number
  to: number
  d: number
  c: number
  sh: number
  e: string
  ico: string
  sha: string
  m: number
  issct: number
  hdf: number
  fdes: string
}

export interface FolderItem {
  cid: string
  pid: string
  uid: number
  aid: number
  n: string
  s: number
  t: string
  te: number
  tp: number
  m: number
  hdf: number
}

export type DriveItem = (FileItem | FolderItem) & { isDir: boolean }

export interface FileListResponse {
  state: boolean
  error: string
  errno: number
  data: {
    count: number
    files: FileItem[]
    folders: FolderItem[]
  }
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface QrCodeStatus {
  status: number
  msg: string
  data?: {
    uid: string
    seid: string
    cookie: string
  }
}

export interface UploadCredential {
  object: string
  callback: string
  callback_var: string
  accessid: string
  host: string
  expire: number
  policy: string
  signature: string
}

export interface DownloadUrl {
  url: string
  file_name: string
  file_size: number
}

export interface TransferTask {
  id: string
  name: string
  size: number
  progress: number
  status: 'pending' | 'running' | 'paused' | 'done' | 'error'
  type: 'upload' | 'download'
  error?: string
}

export interface BreadcrumbItem {
  cid: string
  name: string
}
