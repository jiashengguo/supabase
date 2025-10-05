import { Blocks, FileText, Lightbulb, List, Settings } from 'lucide-react'

import { ICON_SIZE, ICON_STROKE_WIDTH } from 'components/interfaces/Sidebar'
import { generateDatabaseMenu } from 'components/layouts/DatabaseLayout/DatabaseMenu.utils'
import type { Route } from 'components/ui/ui.types'
import { EditorIndexPageLink } from 'data/prefetchers/project.$ref.editor'
import type { Project } from 'data/projects/project-detail-query'
import { IS_PLATFORM, PROJECT_STATUS } from 'lib/constants'

export const generateToolRoutes = (ref?: string, project?: Project, features?: {}): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  return []
}
export const generateProductRoutes = (
  ref?: string,
  project?: Project,
  features?: { auth?: boolean; edgeFunctions?: boolean; storage?: boolean; realtime?: boolean }
): Route[] => {
  const isProjectActive = project?.status === PROJECT_STATUS.ACTIVE_HEALTHY
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  const authEnabled = features?.auth ?? true
  const edgeFunctionsEnabled = features?.edgeFunctions ?? true
  const storageEnabled = features?.storage ?? true
  const realtimeEnabled = features?.realtime ?? true

  const databaseMenu = generateDatabaseMenu(project)

  return []
}

export const generateOtherRoutes = (
  ref?: string,
  project?: Project,
  features?: { unifiedLogs?: boolean; showReports?: boolean }
): Route[] => {
  const isProjectBuilding = project?.status === PROJECT_STATUS.COMING_UP
  const buildingUrl = `/project/${ref}`

  const { unifiedLogs, showReports } = features ?? {}
  const unifiedLogsEnabled = unifiedLogs ?? false
  const reportsEnabled = showReports ?? true

  return [
    {
      key: 'advisors',
      label: 'Advisors',
      icon: <Lightbulb size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/advisors/security`),
    },
    {
      key: 'logs',
      label: 'Logs',
      icon: <List size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link:
        ref &&
        (isProjectBuilding
          ? buildingUrl
          : unifiedLogsEnabled
            ? `/project/${ref}/logs`
            : `/project/${ref}/logs/explorer`),
    },
    {
      key: 'api',
      label: 'API Docs',
      icon: <FileText size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/api`),
    },
    {
      key: 'integrations',
      label: 'Integrations',
      icon: <Blocks size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />,
      link: ref && (isProjectBuilding ? buildingUrl : `/project/${ref}/integrations`),
    },
  ]
}

export const generateSettingsRoutes = (ref?: string, project?: Project): Route[] => {
  return [...(IS_PLATFORM ? [] : [])]
}
