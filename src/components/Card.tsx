import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'
import MCard from '@material-ui/core/Card'

const useStyles = makeStyles({
  card: {
    margin: 10,
    minWidth: 150,
    minHeight: 150,
    textAlign: 'center',
  },
})

type CardProps = {
  title: string
}

export const Card: React.FC<CardProps> = ({ title }) => {
  const styles = useStyles()
  return (
    <Box>
      <MCard className={styles.card}>{title}</MCard>
    </Box>
  )
}
