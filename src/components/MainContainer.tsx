import React from 'react'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'

const useMainStyles = makeStyles({
  mainContainer: {
    marginTop: 100,
  },
})

export const MainContainer: React.FC = ({ children }) => {
  const styles = useMainStyles()

  return <Container className={styles.mainContainer}>{children}</Container>
}
