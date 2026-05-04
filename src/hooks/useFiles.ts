import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFileStore } from '@/stores/fileStore'
import { getFileList, searchFiles } from '@/api/files'
import type { DriveItem, FileItem, FolderItem } from '@/types'

export function useFiles() {
  const { currentCid, searchQuery, sortOrder, setItems, setLoading } = useFileStore()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['files', currentCid, searchQuery, sortOrder],
    queryFn: async () => {
      if (searchQuery) {
        return searchFiles(searchQuery, currentCid)
      }
      return getFileList(currentCid, 0, 100, sortOrder.field, sortOrder.asc ? 1 : 0)
    },
    staleTime: 30_000,
  })

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  useEffect(() => {
    if (data?.data) {
      const folders: DriveItem[] = (data.data.folders ?? []).map((f: FolderItem) => ({
        ...f,
        isDir: true,
      }))
      const files: DriveItem[] = (data.data.files ?? []).map((f: FileItem) => ({
        ...f,
        isDir: false,
      }))
      setItems([...folders, ...files])
    }
  }, [data, setItems])

  return {
    items: useFileStore((s) => s.items),
    isLoading,
    error,
    refetch,
  }
}
