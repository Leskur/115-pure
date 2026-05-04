import { FileItemIcon } from './FileIcon'
import { useFileStore } from '@/stores/fileStore'
import { formatFileSize, formatDate } from '@/utils/format'
import type { DriveItem, FolderItem, FileItem } from '@/types'

interface FileListViewProps {
  items: DriveItem[]
  onDoubleClick: (item: DriveItem) => void
}

export function FileListView({ items, onDoubleClick }: FileListViewProps) {
  const { selectedIds, toggleSelect } = useFileStore()

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-white border-b border-gray-100">
          <tr className="text-left text-gray-500 text-xs font-medium">
            <th className="py-2.5 px-4 w-8">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="py-2.5 px-3">文件名</th>
            <th className="py-2.5 px-3 w-28 text-right">大小</th>
            <th className="py-2.5 px-3 w-40">修改时间</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const id = item.isDir ? (item as FolderItem).cid : (item as FileItem).fid
            const name = item.n
            const size = item.isDir ? null : (item as FileItem).s
            const time = item.t

            return (
              <tr
                key={id}
                onDoubleClick={() => onDoubleClick(item)}
                onClick={() => toggleSelect(id)}
                className={`border-b border-gray-50 cursor-pointer transition-colors ${
                  selectedIds.has(id)
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(id)}
                    onChange={() => toggleSelect(id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded"
                  />
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2.5">
                    <FileItemIcon name={name} isDir={item.isDir} />
                    <span className="truncate max-w-xs text-gray-800">{name}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-right text-gray-500 tabular-nums">
                  {size != null ? formatFileSize(size) : '—'}
                </td>
                <td className="py-2 px-3 text-gray-500">
                  {time ? formatDate(time) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-base">此文件夹为空</p>
        </div>
      )}
    </div>
  )
}
