import React from 'react'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

import { MainContainer } from './MainContainer'

const useStyles = makeStyles({
  cardList: {
    textAlign: 'center',
  },
})

export const CardList: React.FC = ({ children }) => {
  const styles = useStyles()
  return (
    <MainContainer>
      <Box
        display="flex"
        flexWrap="wrap"
        p={1}
        m={5}
        className={styles.cardList}
      >
        {children}
      </Box>
    </MainContainer>
  )
}
