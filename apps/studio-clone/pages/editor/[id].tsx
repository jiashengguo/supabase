import type { NextPageWithLayout } from 'types'
import { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { TableEditorMenu } from 'components/layouts/TableEditorLayout/TableEditorMenu'
import { TableGridEditor } from 'components/interfaces/TableGridEditor/TableGridEditor'
import { TableSelectionProvider } from 'lib/table-selection-context'

const TableEditorPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query

  return (
    <TableSelectionProvider>
      <div className="flex h-screen">
        <TableEditorMenu />
        <TableGridEditor />
      </div>
    </TableSelectionProvider>
  )
}

TableEditorPage.getLayout = (page: ReactElement) => {
  return <>{page}</>
}

export default TableEditorPage
