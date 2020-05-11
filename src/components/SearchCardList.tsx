import React from 'react'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'

import { Page } from '../models/Page'
import { MainContainer } from '../components/MainContainer'
import { SearchCard } from './SearchCard'
import { NewCard } from './NewCard'

const useStyles = makeStyles({
  searchCardList: {
    paddingTop: 50,
  },
})

type SearchCardListProps = {
  pages: Page[]
  query: string
}

export const SearchCardList: React.FC<SearchCardListProps> = ({
  pages,
  query,
}) => {
  const styles = useStyles()

  return (
    <MainContainer>
      {!pages.find(page => page.title === query) && (
        <List component="ul" className={styles.searchCardList}>
          <NewCard title={query} />
        </List>
      )}
      <List component="ul" className={styles.searchCardList}>
        {pages.map(page => (
          <SearchCard page={page} key={page.id} />
        ))}
      </List>
    </MainContainer>
  )
}
