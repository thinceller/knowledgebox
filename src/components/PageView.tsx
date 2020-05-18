import React from 'react'
import { useRouter } from 'next/router'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import { Page } from 'src/models/Page'
import { LineView } from './LineView'
import { apiClient } from 'src/config/client'
import { mutateTitles } from 'src/hooks/usePages'

type PageViewProps = {
  page: Page
  handleButtonClick?: () => void
  isPreview?: boolean
}

const useStyles = makeStyles({
  main: {
    background: 'white',
    padding: '10px 20px',
  },
  button: {
    marginLeft: 20,
  },
})

export const PageView: React.FC<PageViewProps> = ({
  page,
  handleButtonClick,
  isPreview = false,
}) => {
  const styles = useStyles()
  const router = useRouter()

  const handleDeleteClick = React.useCallback(async () => {
    const yes = window.confirm('完全にページを消去します。\nよろしいですか？')
    if (!yes) return

    await apiClient({
      method: 'delete',
      url: `/pages/${page.title}`,
      data: page,
    })
    mutateTitles()
    router.push('/')
  }, [page, router])

  return (
    <Container className={styles.main}>
      <h1>
        {page.title}
        {!isPreview && (
          <Button
            onClick={handleButtonClick}
            variant="contained"
            size="small"
            className={styles.button}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        )}
        {!isPreview && page.id && (
          <Button
            onClick={handleDeleteClick}
            variant="contained"
            color="secondary"
            size="small"
            className={styles.button}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        )}
      </h1>
      {page.lines.map(line => {
        if (line.page_index === 0) {
          return null
        }
        return <LineView key={line.page_index} line={line} />
      })}
    </Container>
  )
}
