import { IS_PLATFORM } from '@common'
import { useProjectLevelTableEditorCommands } from 'components/layouts/TableEditorLayout/TableEditor.Commands'
import { useLayoutNavCommands } from 'components/layouts/useLayoutNavCommands'
import { CommandHeader, CommandInput, CommandList, CommandMenu } from '@ui-patterns/src/CommandMenu'
import { useChangelogCommand } from '@ui-patterns/src/CommandMenu/prepackaged/Changelog'
import { useThemeSwitcherCommands } from '@ui-patterns/src/CommandMenu/prepackaged/ThemeSwitcher'
import { useApiUrlCommand } from './ApiUrl'
import { useSupportCommands } from './Support'
import { orderCommandSectionsByPriority } from './ordering'

export default function StudioCommandMenu() {
  useApiUrlCommand()
  useProjectLevelTableEditorCommands()
  useLayoutNavCommands()
  useSupportCommands()
  useChangelogCommand({ enabled: IS_PLATFORM })
  useThemeSwitcherCommands()

  return (
    <CommandMenu>
      <CommandHeader>
        <CommandInput />
      </CommandHeader>
      <CommandList />
    </CommandMenu>
  )
}
