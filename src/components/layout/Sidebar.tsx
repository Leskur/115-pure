import { HardDriveIcon, FolderIcon, Trash2Icon, DownloadIcon, UserIcon, LogOutIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useFileStore } from '@/stores/fileStore'

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const { currentCid, navigateBack } = useFileStore()

  const goToRoot = () => {
    navigateBack(0)
  }

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-200">
        <div className="bg-blue-600 rounded-lg p-1.5">
          <HardDriveIcon className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900 text-sm">115 Pure</span>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        <button
          onClick={goToRoot}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors ${
            currentCid === '0'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FolderIcon className="w-4 h-4" />
          全部文件
        </button>

        <button
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <DownloadIcon className="w-4 h-4" />
          传输列表
        </button>

        <button
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Trash2Icon className="w-4 h-4" />
          回收站
        </button>
      </nav>

      {user && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            {user.face ? (
              <img src={user.face} alt={user.user_name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium truncate flex-1">{user.user_name}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOutIcon className="w-3.5 h-3.5" />
            退出登录
          </button>
        </div>
      )}
    </aside>
  )
}
