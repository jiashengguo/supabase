import { ActivityIcon, DatabaseIcon, HeartIcon, ServerIcon } from 'lucide-react'
import { ReactNode } from 'react'

export type Metric = {
  key: string
  label: string
  provider?: string
  category?: MetricCategory
  id?: string
}

type MetricCategory = {
  label: string
  icon: (className?: string) => ReactNode
  key: string
}

export const METRIC_CATEGORIES = {
  API: {
    label: 'All API usage',
    icon: (className?: string) => <ActivityIcon size={16} className={className} />,
    key: 'api',
  },
  API_DATABASE: {
    label: 'Database API',
    icon: (className?: string) => <DatabaseIcon size={16} className={className} />,
    key: 'api_database',
  },
  INSTANCE: {
    label: 'Instance health',
    icon: (className?: string) => <HeartIcon size={16} className={className} />,
    key: 'instance',
  },
  SUPAVISOR: {
    label: 'Supavisor',
    icon: (className?: string) => <ServerIcon size={16} className={className} />,
    key: 'supavisor',
  },
}

// [Joshen] Eventually we can remove some charts here from DEPRECATED_REPORTS from Reports.constants.ts
export const METRICS: Metric[] = [
  {
    key: 'avg_cpu_usage',
    label: 'Average CPU % Usage',
    provider: 'infra-monitoring',
    category: METRIC_CATEGORIES.INSTANCE,
  },
  {
    key: 'max_cpu_usage',
    label: 'Max CPU % Usage',
    provider: 'infra-monitoring',
    category: METRIC_CATEGORIES.INSTANCE,
  },
  {
    key: 'disk_io_consumption',
    label: 'Disk IO % Consumed',
    provider: 'infra-monitoring',
    category: METRIC_CATEGORIES.INSTANCE,
  },
  {
    key: 'disk_io_budget',
    label: 'Disk IO % Remaining',
    provider: 'infra-monitoring',
    category: METRIC_CATEGORIES.INSTANCE,
  },
  {
    key: 'ram_usage',
    label: 'Memory % Usage',
    provider: 'infra-monitoring',
    category: METRIC_CATEGORIES.INSTANCE,
  },
  {
    key: 'total_realtime_egress',
    label: 'Realtime Connection Egress',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },
  /**
   * API
   */
  {
    key: 'total_rest_ingress',
    label: 'API Ingress',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API_DATABASE,
  },
  {
    key: 'total_rest_egress',
    label: 'API Egress',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API_DATABASE,
  },
  {
    key: 'total_rest_requests',
    label: 'API Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API_DATABASE,
  },
  {
    key: 'total_rest_get_requests',
    label: 'API GET Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API_DATABASE,
  },
  {
    key: 'total_rest_post_requests',
    label: 'API POST Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API_DATABASE,
  },
  {
    key: 'total_rest_patch_requests',
    label: 'API PATCH Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API_DATABASE,
  },
  {
    key: 'total_rest_delete_requests',
    label: 'API DELETE Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API_DATABASE,
  },
  {
    key: 'total_rest_options_requests',
    label: 'API OPTIONS Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API_DATABASE,
  },

  {
    key: 'total_egress',
    label: 'All Egress',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },

  {
    key: 'total_get_requests',
    label: 'All GET Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },

  {
    key: 'total_requests',
    label: 'All Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },
  {
    key: 'total_patch_requests',
    label: 'All PATCH Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },
  {
    key: 'total_post_requests',
    label: 'All POST Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },

  {
    key: 'total_ingress',
    label: 'All Ingress',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },
  {
    key: 'total_delete_requests',
    label: 'All DELETE Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },
  {
    key: 'total_options_requests',
    label: 'All OPTIONS Requests',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.API,
  },

  /** Supavisor */
  {
    key: 'total_supavisor_egress_bytes',
    label: 'Shared Pooler Egress',
    provider: 'daily-stats',
    category: METRIC_CATEGORIES.SUPAVISOR,
  },
]

export const TIME_PERIODS_BILLING = [
  {
    key: 'currentBillingCycle',
    label: 'Current billing cycle',
    interval: '1d',
  },
  {
    key: 'previousBillingCycle',
    label: 'Previous billing cycle',
    interval: '1d',
  },
]

export const TIME_PERIODS_REPORTS = [
  {
    key: '7d',
    label: 'Last 7 days',
    interval: '1d',
  },
  {
    key: '30d',
    label: 'Last 30 days',
    interval: '1d',
  },
  {
    key: 'startMonth',
    label: 'This month',
    interval: '1d',
  },
]

export const TIME_PERIODS_INFRA = [
  {
    key: '10m',
    label: 'Last 10 minutes',
  },
  {
    key: '30m',
    label: 'Last 30 minutes',
  },
  {
    key: '1h',
    label: 'Last hour',
  },
  {
    key: '3h',
    label: 'Last 3 hours',
  },
  {
    key: '1d',
    label: 'Last 24 hours',
  },
  {
    key: '7d',
    label: 'Last 7 days',
  },
]
