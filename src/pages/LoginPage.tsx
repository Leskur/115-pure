import { CloudIcon, HardDriveIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const { login, isLoading, error } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 rounded-2xl p-4 mb-4">
            <HardDriveIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">115 Pure</h1>
          <p className="text-gray-500 text-sm mt-1">115 网盘客户端</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 leading-relaxed">
            <p className="font-medium mb-1 flex items-center gap-1.5">
              <CloudIcon className="w-4 h-4" />
              如何登录
            </p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>点击下方"使用 115 账号登录"按钮</li>
              <li>系统浏览器将自动打开授权页面</li>
              <li>使用手机扫码或账号密码完成授权</li>
              <li>授权后自动返回应用</li>
            </ol>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            onClick={login}
            loading={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? '等待授权...' : '使用 115 账号登录'}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          需要在 115 开放平台注册应用并配置 VITE_115_CLIENT_ID
        </p>
      </div>
    </div>
  )
}
