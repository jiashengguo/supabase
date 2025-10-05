import { proxy, snapshot, useSnapshot } from 'valtio'

export const consentState = proxy({
  // Usercentrics state
  UC: null,
  categories: null,

  // Our state
  showConsentToast: false,
  hasConsented: false,
  acceptAll: () => {
    if (!consentState.UC) return
    const previousConsentValue = consentState.hasConsented

    consentState.hasConsented = true
    consentState.showConsentToast = false
  },
  denyAll: () => {
    if (!consentState.UC) return
    const previousConsentValue = consentState.hasConsented

    consentState.hasConsented = false
    consentState.showConsentToast = false
  },
})

async function initUserCentrics() {
  // if (process.env.NODE_ENV === 'test' || !IS_PLATFORM) return
  // // [Alaister] For local development and staging, we accept all consent by default.
  // // If you need to test usercentrics in these environments, comment out this
  // // NEXT_PUBLIC_ENVIRONMENT check and add an ngrok domain to usercentrics
  // if (
  //   process.env.NEXT_PUBLIC_ENVIRONMENT === 'local' ||
  //   process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging'
  // ) {
  //   consentState.hasConsented = true
  //   return
  // }
  // const { default: Usercentrics } = await import('@usercentrics/cmp-browser-sdk')
  // const UC = new Usercentrics(process.env.NEXT_PUBLIC_USERCENTRICS_RULESET_ID!, {
  //   rulesetId: process.env.NEXT_PUBLIC_USERCENTRICS_RULESET_ID,
  //   useRulesetId: true,
  // })
  // const initialUIValues = await UC.init()
  // consentState.UC = UC
  // const hasConsented = UC.areAllConsentsAccepted()
  // // 0 = first layer, aka show consent toast
  // consentState.showConsentToast = initialUIValues.initialLayer === 0
  // consentState.hasConsented = hasConsented
  // consentState.categories = UC.getCategoriesBaseInfo()
  // // If the user has previously consented (before usercentrics), accept all services
  // if (!hasConsented && localStorage?.getItem(LOCAL_STORAGE_KEYS.TELEMETRY_CONSENT) === 'true') {
  //   consentState.acceptAll()
  //   localStorage.removeItem(LOCAL_STORAGE_KEYS.TELEMETRY_CONSENT)
  // }
}

// Usercentrics is not available on the server
if (typeof window !== 'undefined') {
  initUserCentrics()
}

// Public API for consent

export function hasConsented() {
  return snapshot(consentState).hasConsented
}

export function useConsentState() {
  const snap = useSnapshot(consentState)

  return {
    hasAccepted: snap.hasConsented,
    acceptAll: snap.acceptAll,
    denyAll: snap.denyAll,
  }
}
