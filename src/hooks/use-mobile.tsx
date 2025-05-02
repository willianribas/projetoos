
import * as React from "react"

// A breakpoint that represents mobile devices
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initialize with the current window width if available
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    // Default to false for SSR
    return false
  })

  React.useEffect(() => {
    // Skip if not in browser environment
    if (typeof window === 'undefined') return

    // Function to update state based on window size
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add event listener with debounce for performance
    let timeoutId: number | null = null
    const debouncedHandleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(handleResize, 100) as unknown as number
    }

    window.addEventListener('resize', debouncedHandleResize)
    
    // Set initial state
    handleResize()

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return isMobile
}
