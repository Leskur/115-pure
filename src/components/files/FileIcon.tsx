import {
  FolderIcon,
  FileIcon,
  FileImageIcon,
  FileVideoIcon,
  FileAudioIcon,
  FileTextIcon,
  FileArchiveIcon,
} from 'lucide-react'
import { getFileCategory } from '@/utils/format'

interface FileIconProps {
  name: string
  isDir: boolean
  className?: string
}

export function FileItemIcon({ name, isDir, className = 'w-5 h-5' }: FileIconProps) {
  if (isDir) {
    return <FolderIcon className={`${className} text-yellow-500`} />
  }

  const category = getFileCategory(name)

  const icons = {
    image: <FileImageIcon className={`${className} text-green-500`} />,
    video: <FileVideoIcon className={`${className} text-purple-500`} />,
    audio: <FileAudioIcon className={`${className} text-pink-500`} />,
    doc: <FileTextIcon className={`${className} text-blue-500`} />,
    archive: <FileArchiveIcon className={`${className} text-orange-500`} />,
    other: <FileIcon className={`${className} text-gray-400`} />,
  }

  return icons[category]
}
