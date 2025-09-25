import React from "react"
import clsx from "clsx"

export const Badge = ({ variant = "default", children, className }) => {
  const base = "px-2 py-1 rounded text-sm font-medium"
  const variants = {
    default: "bg-green-100 text-green-800",
    secondary: "bg-gray-200 text-gray-800",
    destructive: "bg-red-100 text-red-800"
  }
  return <span className={clsx(base, variants[variant], className)}>{children}</span>
}

