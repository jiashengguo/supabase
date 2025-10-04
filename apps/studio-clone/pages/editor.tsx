import type { NextPageWithLayout } from 'types'
import { ReactElement } from 'react'
import { TableEditorMenu } from 'components/layouts/TableEditorLayout/TableEditorMenu'
import { TableGridEditor } from 'components/interfaces/TableGridEditor/TableGridEditor'
import { TableSelectionProvider } from 'lib/table-selection-context'

const EditorPage: NextPageWithLayout = () => {
  return (
    <TableSelectionProvider>
      <div className="flex h-screen">
        <TableEditorMenu />
        <TableGridEditor />
      </div>
    </TableSelectionProvider>
  )
}

EditorPage.getLayout = (page: ReactElement) => {
  return <>{page}</>
}

export default EditorPage
