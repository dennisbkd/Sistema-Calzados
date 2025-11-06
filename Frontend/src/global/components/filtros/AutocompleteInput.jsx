import React, { useEffect, useMemo, useRef, useState } from 'react'

export const AutocompleteInput = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  fetchOptions, // async (term) => [{ id, label }]
  onSelect,
  className = ''
}) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!fetchOptions) return
      const term = (value || '').trim()
      if (term.length < 1) { setOptions([]); return }
      setLoading(true)
      try {
        const res = await fetchOptions(term)
        if (active) setOptions(res || [])
      } finally {
        if (active) setLoading(false)
      }
    }
    const t = setTimeout(run, 250)
    return () => { active = false; clearTimeout(t) }
  }, [value, fetchOptions])

  const handleSelect = (opt) => {
    onChange(opt.label)
    onSelect && onSelect(opt)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        placeholder={placeholder}
        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onFocus={() => setOpen(true)}
      />
      {open && (options.length > 0 || loading) && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-500">Cargando...</div>
          )}
          {!loading && options.map((opt) => (
            <button
              key={`${opt.id}-${opt.label}`}
              type="button"
              onClick={() => handleSelect(opt)}
              className="w-full text-left px-3 py-2 hover:bg-blue-50"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

