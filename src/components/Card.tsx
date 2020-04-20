import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MCard from '@material-ui/core/Card'

const useStyles = makeStyles({
  root: {
    margin: 5,
    minWidth: 250,
    maxWidth: 300,
    minHeight: 250,
    maxHeight: 300,
    display: 'inline-block',
    textAlign: 'center',
  },
})

type CardProps = {
  title: string
}

export const Card: React.FC<CardProps> = ({ title }) => {
  const styles = useStyles()
  return <MCard className={styles.root}>{title}</MCard>
}
