import React from 'react'
import Container from '@material-ui/core/Container'

export const Layout: React.FC = ({ children }) => {
  return <Container maxWidth="lg">{children}</Container>
}
