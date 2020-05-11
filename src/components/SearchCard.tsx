import React from 'react'
import Link from 'next/link'
import ListItem from '@material-ui/core/ListItem'
import Box from '@material-ui/core/Box'
import MCard from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'

import { Page } from '../models/Page'

const useStyles = makeStyles({
  searchCard: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  card: {
    height: 80,
  },
})

type SearchCardProps = {
  page: Page
}

export const SearchCard: React.FC<SearchCardProps> = ({ page }) => {
  const styles = useStyles()

  return (
    <ListItem className={styles.searchCard}>
      <Box component="span" display="block" width="100%">
        <Link href="/[title]" as={`/${page.title}`}>
          <a style={{ textDecoration: 'none' }}>
            <MCard className={styles.card}>{page.title}</MCard>
          </a>
        </Link>
      </Box>
    </ListItem>
  )
}
