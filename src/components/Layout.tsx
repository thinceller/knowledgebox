import React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  main: {
    marginTop: 30,
    textAlign: 'center',
  },
})

export const Layout: React.FC = ({ children }) => {
  const styles = useStyles()
  return (
    <Container maxWidth="lg">
      <Box display="flex" flexWrap="wrap" p={1} m={5}>
        {children}
      </Box>
    </Container>
  )
}
