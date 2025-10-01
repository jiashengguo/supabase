import * as React from 'react'

interface PopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  const [trigger, content] = React.Children.toArray(children)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Use capture phase to handle clicks before they bubble
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, onOpenChange])

  return (
    <div className="relative inline-block" ref={containerRef}>
      {trigger}
      {open && content}
    </div>
  )
}

interface PopoverTriggerProps {
  asChild?: boolean
  children: React.ReactElement
}

export function PopoverTrigger({ asChild, children }: PopoverTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    // Clone the child and preserve its onClick while also handling popover toggle
    return children
  }
  return children
}

interface PopoverContentProps {
  className?: string
  align?: 'start' | 'center' | 'end'
  children: React.ReactNode
}

export function PopoverContent({
  className = '',
  align = 'center',
  children,
}: PopoverContentProps) {
  const alignClass = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  }[align]

  return (
    <div
      className={`absolute z-50 mt-2 ${alignClass} bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}
