import { SearchIcon, LayoutListIcon, LayoutGridIcon, RefreshCwIcon, UploadIcon, FolderPlusIcon } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useFileStore } from '@/stores/fileStore'

interface ToolbarProps {
  onRefresh: () => void
  isLoading: boolean
}

export function Toolbar({ onRefresh, isLoading }: ToolbarProps) {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useFileStore()

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
      <div className="flex-1 max-w-sm">
        <Input
          icon={<SearchIcon className="w-4 h-4" />}
          placeholder="搜索文件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <Button variant="ghost" size="sm" title="新建文件夹">
          <FolderPlusIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" title="上传文件">
          <UploadIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          loading={isLoading}
          title="刷新"
        >
          <RefreshCwIcon className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        <button
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          title="列表视图"
        >
          <LayoutListIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
          title="网格视图"
        >
          <LayoutGridIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
