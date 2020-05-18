import React from 'react'
import Link from 'next/link'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import MCard from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import LinkIcon from '@material-ui/icons/Link'

const useStyles = makeStyles({
  card: {
    margin: 10,
    paddingTop: 5,
    minWidth: 150,
    minHeight: 150,
    textAlign: 'left',
  },
  linkCard: {
    margin: 10,
    paddingTop: 5,
    minWidth: 150,
    minHeight: 150,
    color: 'skyblue',
  },
  existLinkCard: {
    margin: 10,
    paddingTop: 5,
    minWidth: 150,
    minHeight: 150,
    color: 'gray',
  },
  newLinkCard: {
    margin: 10,
    paddingTop: 5,
    minWidth: 150,
    minHeight: 150,
    color: 'red',
  },
})

type CardProps = {
  title: string
  handleMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void
}

export const Card: React.FC<CardProps> = ({
  title,
  handleMouseEnter = undefined,
}) => {
  const styles = useStyles()

  return (
    <Box>
      <Link href="/[title]" as={`/${title}`}>
        <a style={{ textDecoration: 'none' }} onMouseEnter={handleMouseEnter}>
          <MCard className={styles.card}>
            <CardContent>
              <span>{title}</span>
            </CardContent>
          </MCard>
        </a>
      </Link>
    </Box>
  )
}

export const LinkCard: React.FC = () => {
  const styles = useStyles()

  return (
    <Box>
      <MCard className={styles.linkCard}>
        <Box>
          <CardContent>
            <LinkIcon />
          </CardContent>
          <CardContent>Links</CardContent>
        </Box>
      </MCard>
    </Box>
  )
}

export const NewLinkCard: React.FC = () => {
  const styles = useStyles()

  return (
    <Box>
      <MCard className={styles.newLinkCard}>
        <Box>
          <CardContent>
            <LinkIcon />
          </CardContent>
          <CardContent>New Links</CardContent>
        </Box>
      </MCard>
    </Box>
  )
}

export const ExistLinkCard: React.FC<CardProps> = ({
  title,
  handleMouseEnter,
}) => {
  const styles = useStyles()

  return (
    <Box>
      <Link href="/[title]" as={`/${title}`}>
        <a style={{ textDecoration: 'none' }} onMouseEnter={handleMouseEnter}>
          <MCard className={styles.existLinkCard}>
            <Box>
              <CardContent>
                <LinkIcon />
              </CardContent>
              <CardContent>{title}</CardContent>
            </Box>
          </MCard>
        </a>
      </Link>
    </Box>
  )
}
