import React from "react"

export const Input = (props) => (
  <input {...props} className={`border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 ${props.className || ""}`} />
)
