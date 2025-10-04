import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export interface Project {
  id: number
  ref: string
  name: string
  status: string
  organization_id: number
  cloud_provider: string
  region: string
  inserted_at: string
  subscription_id: string
}

export interface Table {
  id: number
  schema: string
  name: string
  rls_enabled: boolean
  rls_forced: boolean
  replica_identity: string
  bytes: number
  size: string
  seq_scan_count: number
  seq_tup_read: number
  idx_scan_count: number
  idx_tup_fetch: number
  n_tup_ins: number
  n_tup_upd: number
  n_tup_del: number
  n_tup_hot_upd: number
  n_live_tup: number
  n_dead_tup: number
  n_mod_since_analyze: number
  last_vacuum?: string
  last_autovacuum?: string
  last_analyze?: string
  last_autoanalyze?: string
  vacuum_count: number
  autovacuum_count: number
  analyze_count: number
  autoanalyze_count: number
  comment?: string
}
