import { useIsLoggedIn } from '@common'
import { useTableEditorGotoCommands } from './TableEditorLayout/TableEditor.Commands'

export function useLayoutNavCommands() {
  const isLoggedIn = useIsLoggedIn()

  useTableEditorGotoCommands({ enabled: isLoggedIn })
}
