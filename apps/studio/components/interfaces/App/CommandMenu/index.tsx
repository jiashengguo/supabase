import dynamic from 'next/dynamic'

import { useCommandMenuInitiated } from '@ui-patterns/src/CommandMenu'

const LazyCommandMenu = dynamic(() => import('./CommandMenu'), { ssr: false })

const StudioCommandMenu = () => {
  const isInitiated = useCommandMenuInitiated()
  return isInitiated && <LazyCommandMenu />
}

export { StudioCommandMenu }
