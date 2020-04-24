import React from 'react'
import Container from '@material-ui/core/Container'

import { useMainStyles } from './CardList'

export const Editor: React.FC = ({ children }) => {
  const styles = useMainStyles()
  return <Container className={styles.mainContainer}>{children}</Container>
}
