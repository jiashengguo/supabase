import { useRouter } from 'next/router'
import { PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { toast } from 'sonner'

import { useIsLoggedIn, useUser } from '@common'
import { useProfileQuery } from 'data/profile/profile-query'
import type { Profile } from 'data/profile/types'
import type { ResponseError } from 'types'
import { useSignOut } from './auth'

export type ProfileContextType = {
  profile: Profile | undefined
  error: ResponseError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
}

export const ProfileContext = createContext<ProfileContextType>({
  profile: undefined,
  error: null,
  isLoading: true,
  isError: false,
  isSuccess: false,
})

export const ProfileProvider = ({ children }: PropsWithChildren<{}>) => {
  const user = useUser()
  const isLoggedIn = useIsLoggedIn()
  const router = useRouter()
  const signOut = useSignOut()

  // Track telemetry for the current user
  const {
    error,
    data: profile,
    isLoading: isLoadingProfile,
    isError,
    isSuccess,
  } = useProfileQuery({
    enabled: isLoggedIn,
    onError(err) {
      // [Alaister] If the user has a bad auth token, auth-js won't know about it
      // and will think the user is authenticated. Since fetching the profile happens
      // on every page load, we can check for a 401 here and sign the user out if
      // they have a bad token.
      if (err.code === 401) {
        signOut().then(() => router.push('/sign-in'))
      }
    },
  })

  const value = useMemo(() => {
    const isLoading = isLoadingProfile

    return {
      error,
      profile,
      isLoading,
      isError,
      isSuccess,
    }
  }, [isLoadingProfile, profile, error, isError, isSuccess])

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export const useProfile = () => useContext(ProfileContext)
