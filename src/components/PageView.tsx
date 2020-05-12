import React from 'react'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { Page } from 'src/models/Page'
import { LineView } from './LineView'

type PageViewProps = {
  page: Page
  handleButtonClick?: () => void
  isPreview?: boolean
}

const useStyles = makeStyles({
  main: {
    background: 'white',
    paddingLeft: 10,
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

  return (
    <Container className={styles.main}>
      <h1>
        {page.title}
        {!isPreview && (
          <Button
            onClick={handleButtonClick}
            variant="contained"
            className={styles.button}
          >
            Edit
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
