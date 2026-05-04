import { ChevronRightIcon, HomeIcon } from 'lucide-react'
import { useFileStore } from '@/stores/fileStore'

export function Breadcrumb() {
  const { breadcrumbs, navigateBack } = useFileStore()

  return (
    <nav className="flex items-center gap-1 text-sm py-2 px-1">
      {breadcrumbs.map((item, index) => (
        <div key={item.cid} className="flex items-center gap-1">
          {index > 0 && <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
          <button
            onClick={() => navigateBack(index)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-colors max-w-[160px] truncate ${
              index === breadcrumbs.length - 1
                ? 'text-gray-900 font-medium cursor-default'
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            }`}
            disabled={index === breadcrumbs.length - 1}
          >
            {index === 0 && <HomeIcon className="w-3.5 h-3.5 flex-shrink-0" />}
            <span className="truncate">{item.name}</span>
          </button>
        </div>
      ))}
    </nav>
  )
}
