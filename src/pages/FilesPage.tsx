import { Breadcrumb } from '@/components/files/Breadcrumb'
import { FileListView } from '@/components/files/FileListView'
import { Toolbar } from '@/components/files/Toolbar'
import { useFiles } from '@/hooks/useFiles'
import { useFileStore } from '@/stores/fileStore'
import type { DriveItem, FolderItem } from '@/types'

export function FilesPage() {
  const { items, isLoading, refetch } = useFiles()
  const { navigateTo } = useFileStore()

  const handleDoubleClick = (item: DriveItem) => {
    if (item.isDir) {
      const folder = item as FolderItem
      navigateTo(folder.cid, folder.n)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Toolbar onRefresh={refetch} isLoading={isLoading} />
      <div className="px-4 pt-1">
        <Breadcrumb />
      </div>
      {isLoading && items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">加载中...</span>
          </div>
        </div>
      ) : (
        <FileListView items={items} onDoubleClick={handleDoubleClick} />
      )}
    </div>
  )
}
