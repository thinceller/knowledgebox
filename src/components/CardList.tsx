import React from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

export const useMainStyles = makeStyles({
  mainContainer: {
    marginTop: 64,
  },
  cardList: {
    textAlign: 'center',
  },
})

const useStyles = makeStyles({
  cardList: {
    textAlign: 'center',
  },
})
export const CardList: React.FC = ({ children }) => {
  const mainStyles = useMainStyles()
  const styles = useStyles()
  return (
    <Container className={mainStyles.mainContainer}>
      <Box
        display="flex"
        flexWrap="wrap"
        p={1}
        m={5}
        className={styles.cardList}
      >
        {children}
      </Box>
    </Container>
  )
}
