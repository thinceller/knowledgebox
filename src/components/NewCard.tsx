import React from 'react'
import Link from 'next/link'
import ListItem from '@material-ui/core/ListItem'
import Box from '@material-ui/core/Box'
import MCard from '@material-ui/core/Card'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  searchCard: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  card: {
    height: 80,
  },
})

type NewCardProps = {
  title: string
}

export const NewCard: React.FC<NewCardProps> = ({ title }) => {
  const styles = useStyles()

  return (
    <ListItem className={styles.searchCard}>
      <Box component="span" display="block" width="100%">
        <Link href="/[title]" as={`/${title}`}>
          <a style={{ textDecoration: 'none' }}>
            <MCard className={styles.card}>
              <AddIcon />
              {title}
            </MCard>
          </a>
        </Link>
      </Box>
    </ListItem>
  )
}
