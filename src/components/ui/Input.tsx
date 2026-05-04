import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, className = '', ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-400">{icon}</span>
          <input
            ref={ref}
            className={`w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 ${className}`}
            {...props}
          />
        </div>
      )
    }
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
