import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  main: {
    marginTop: 30,
    textAlign: 'center',
  },
})

export const CardList: React.FC = ({ children }) => {
  const styles = useStyles()
  return (
    <Box display="flex" flexWrap="wrap" p={1} m={5} className={styles.main}>
      {children}
    </Box>
  )
}
