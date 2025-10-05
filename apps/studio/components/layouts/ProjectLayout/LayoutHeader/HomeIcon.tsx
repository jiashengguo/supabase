import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { LOCAL_STORAGE_KEYS } from '@common'
import { useLocalStorageQuery } from 'hooks/misc/useLocalStorage'
import { IS_PLATFORM } from 'lib/constants'

export const HomeIcon = () => {
  const router = useRouter()
  const [lastVisitedOrganization] = useLocalStorageQuery(
    LOCAL_STORAGE_KEYS.LAST_VISITED_ORGANIZATION,
    ''
  )

  const href = '/project/default'

  return (
    <Link href={href} className="items-center justify-center flex-shrink-0 hidden md:flex">
      <Image
        alt="Supabase"
        src={`${router.basePath}/img/supabase-logo.svg`}
        width={18}
        height={18}
        className="w-[18px] h-[18px]"
      />
    </Link>
  )
}
