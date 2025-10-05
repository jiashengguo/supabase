import { AlertTriangleIcon } from 'lucide-react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { IS_PLATFORM, LOCAL_STORAGE_KEYS } from '@common'
import { HomePageActions } from 'components/interfaces/HomePageActions'
import { PageLayout } from 'components/layouts/PageLayout/PageLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import { useLocalStorageQuery } from 'hooks/misc/useLocalStorage'
import { withAuth } from 'hooks/misc/withAuth'

// [Joshen] I'd say we don't do route validation here, this page will act more
// like a proxy to the project specific pages, and we let those pages handle
// any route validation logic instead

const GenericProjectPage: NextPage = () => {
  const router = useRouter()
  const { routeSlug, ...queryParams } = router.query

  const [lastVisitedOrgSlug] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.LAST_VISITED_ORGANIZATION,
    ''
  )

  const [selectedSlug, setSlug] = useState(lastVisitedOrgSlug)

  const query = Object.keys(queryParams).length
    ? `?${new URLSearchParams(queryParams as Record<string, string>)}`
    : undefined

  const urlRewriterFactory = (slug: string | string[] | undefined) => {
    return (projectRef: string) => {
      const hash = location.hash

      if (!Array.isArray(slug)) {
        return [`/project/${projectRef}`, query, hash].filter(Boolean).join('')
      }

      const slugPath = slug.join('/')
      return [`/project/${projectRef}/${slugPath}`, query, hash].filter(Boolean).join('')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <PageLayout className="flex-grow min-h-0" title="Select a project to continue">
        <ScaffoldContainer className="flex-grow flex flex-col">
          <ScaffoldSection
            isFullWidth
            className="flex-grow pt-0 flex flex-col gap-y-4 h-px"
          ></ScaffoldSection>
        </ScaffoldContainer>
      </PageLayout>
    </div>
  )
}

export default withAuth(GenericProjectPage)
