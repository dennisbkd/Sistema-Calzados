import React from "react"
import clsx from "clsx"

export const Button = ({ variant = "default", size = "md", className, ...props }) => {
  const base = "rounded px-4 py-2 font-medium transition-colors"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  }
  const sizes = {
    sm: "text-sm px-2 py-1",
    md: "text-base",
    lg: "text-lg"
  }
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />
}

