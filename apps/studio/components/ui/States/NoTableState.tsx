import { useRouter } from 'next/router'

interface Props {
  message: string
}

const NoTableState: React.FC<Props> = ({ message }) => {
  const router = useRouter()
  const { ref } = router.query

  return <p className="text-sm text-foreground-light">{message}</p>
}

export default NoTableState
