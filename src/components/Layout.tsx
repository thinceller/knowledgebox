import React from 'react'
import Container from '@material-ui/core/Container'

import { Header } from './Header'

export const Layout: React.FC = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Header />
      {children}
    </Container>
  )
}
